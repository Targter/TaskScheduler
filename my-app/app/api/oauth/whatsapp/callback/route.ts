import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { requireUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireUser(); // 1. Verify User

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return new Response(`OAuth Error: ${error || "No code provided"}`, { status: 400 });
  }

  const clientId = process.env.META_CLIENT_ID!;
  const clientSecret = process.env.META_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/whatsapp/callback`;

  try {
    // 2. Exchange Code for Short-Lived Access Token
    const tokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
    tokenUrl.searchParams.append("client_id", clientId);
    tokenUrl.searchParams.append("client_secret", clientSecret);
    tokenUrl.searchParams.append("redirect_uri", redirectUri);
    tokenUrl.searchParams.append("code", code);

    const tokenResponse = await fetch(tokenUrl.toString(), { method: "GET" });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Meta Token Error:", tokenData);
      return new Response("Failed to fetch tokens from Meta", { status: 400 });
    }

    let accessToken = tokenData.access_token;
    let expiresIn = tokenData.expires_in; // Usually 3600 seconds (1 hour)

    // 3. Exchange Short-Lived Token for Long-Lived Token (60 Days)
    // Meta doesn't use "offline.access" like Twitter; they use token exchange.
    const longLivedUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
    longLivedUrl.searchParams.append("grant_type", "fb_exchange_token");
    longLivedUrl.searchParams.append("client_id", clientId);
    longLivedUrl.searchParams.append("client_secret", clientSecret);
    longLivedUrl.searchParams.append("fb_exchange_token", accessToken);

    const longLivedResponse = await fetch(longLivedUrl.toString(), { method: "GET" });
    const longLivedData = await longLivedResponse.json();

    if (longLivedResponse.ok && longLivedData.access_token) {
      accessToken = longLivedData.access_token;
      expiresIn = longLivedData.expires_in || 5184000; // ~60 days
    }

    // 4. Fetch User's Meta/Facebook ID (For externalId)
    const userResponse = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${accessToken}`);
    const userData = await userResponse.json();

    if (!userData.id) {
      return new Response("Failed to fetch Meta user data", { status: 400 });
    }

    const metaUserId = userData.id;

    // 5. Encrypt & Save to DB
    // Note: Meta does not typically provide a 'refresh_token'. 
    // You must re-auth or rotate the Long-Lived token before 60 days.
    await prisma.platformAccount.upsert({
      where: {
        platform_externalId: {
          platform: "WHATSAPP", // Ensure this enum exists in your Prisma Schema
          externalId: metaUserId,
        },
      },
      update: {
        encryptedAccessToken: encrypt(accessToken),
        // Meta doesn't usually send a refresh token, so we set null or keep existing
        encryptedRefreshToken: null, 
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
      create: {
        userId: user.id,
        platform: "WHATSAPP",
        externalId: metaUserId,
        encryptedAccessToken: encrypt(accessToken),
        encryptedRefreshToken: null,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });

  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error during WhatsApp OAuth", { status: 500 });
  }

  // 6. Success! Back to connections page
  return redirect("/dashboard?success=true");
}