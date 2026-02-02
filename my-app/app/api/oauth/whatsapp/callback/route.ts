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
    // ---------------------------------------------------------
    // 2. Exchange Code for Short-Lived Access Token
    // ---------------------------------------------------------
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
    let expiresIn = tokenData.expires_in;

    // ---------------------------------------------------------
    // 3. Exchange Short-Lived Token for Long-Lived Token (60 Days)
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 4. [NEW] Fetch WABA ID (WhatsApp Business Account ID)
    // ---------------------------------------------------------
    // We inspect the token to find which Business Account it belongs to.
    const debugUrl = new URL("https://graph.facebook.com/v20.0/debug_token");
    debugUrl.searchParams.append("input_token", accessToken);
    debugUrl.searchParams.append("access_token", `${clientId}|${clientSecret}`); // App Token

    const debugRes = await fetch(debugUrl.toString(), { method: "GET" });
    const debugData = await debugRes.json();

    // Look for 'whatsapp_business_management' scope to find the WABA ID
    const wabaScope = debugData.data?.granular_scopes?.find(
      (scope: any) => scope.scope === "whatsapp_business_management"
    );
    const wabaId = wabaScope?.target_ids?.[0];

    if (!wabaId) {
      throw new Error("Could not find WhatsApp Business Account ID (WABA) in token scopes.");
    }

    // ---------------------------------------------------------
    // 5. [NEW] Fetch Phone Number ID
    // ---------------------------------------------------------
    // Now we ask the WABA for its registered phone numbers.
    const phoneRes = await fetch(
      `https://graph.facebook.com/v20.0/${wabaId}/phone_numbers?access_token=${accessToken}`
    );
    const phoneData = await phoneRes.json();
    
    // We select the first phone number found.
    const phoneNumberId = phoneData.data?.[0]?.id;

    if (!phoneNumberId) {
      throw new Error("No phone number found associated with this WhatsApp Business Account.");
    }

    // ---------------------------------------------------------
    // 6. Fetch User's Meta/Facebook ID (For externalId)
    // ---------------------------------------------------------
    const userResponse = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${accessToken}`);
    const userData = await userResponse.json();

    if (!userData.id) {
      return new Response("Failed to fetch Meta user data", { status: 400 });
    }

    const metaUserId = userData.id;

    // ---------------------------------------------------------
    // 7. Encrypt & Save to DB
    // ---------------------------------------------------------
    await prisma.platformAccount.upsert({
      where: {
        platform_externalId: {
          platform: "WHATSAPP",
          externalId: metaUserId,
        },
      },
      update: {
        encryptedAccessToken: encrypt(accessToken),
        
        // WORKAROUND: Storing Phone Number ID in the unused Refresh Token field
        // because your schema does not have a phoneNumberId column.
        encryptedRefreshToken: encrypt(phoneNumberId), 
        
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
      create: {
        userId: user.id,
        platform: "WHATSAPP",
        externalId: metaUserId,
        
        encryptedAccessToken: encrypt(accessToken),
        // WORKAROUND: Storing Phone Number ID here
        encryptedRefreshToken: encrypt(phoneNumberId), 
        
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });

  } catch (error) {
    console.error("WhatsApp Callback Error:", error);
    return new Response("Internal Server Error during WhatsApp OAuth", { status: 500 });
  }

  // 8. Success! Back to connections page
  return redirect("/dashboard?success=true");
}