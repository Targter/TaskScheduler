
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { requireUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireUser(); // 1. Verify User

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
//   console.log("code:",code)

  if (!code) return new Response("No code provided", { status: 400 });


  
  // 2. Exchange Code for Access Token
  // Twitter requires Basic Auth header with Client ID:Secret
  const basicAuth = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");
  console.log("Twiclid:",process.env.TWITTER_CLIENT_ID)
  console.log("Twiclid:",process.env.TWITTER_CLIENT_SECRET)
  console.log("basicauth:",basicAuth)
  try {
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/oauth/twitter/callback`,
        code_verifier: "challenge", // Must match the one sent in step 4
      }),
    });
    console.log("tokenREponse:oautcallback",tokenResponse)

    const tokenData = await tokenResponse.json();
    console.log("oautcallback",tokenData)

    if (!tokenResponse.ok) {
      console.error("Twitter Token Error:", tokenData);
      return new Response("Failed to fetch tokens from Twitter", { status: 400 });
    }

    // 3. Fetch User's Twitter ID (We need this for the 'externalId' field)
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    console.log("USER RESPONSE STATUS:", userResponse.status);
    console.log("userresponse:",userResponse)
    const userData = await userResponse.json();
    console.log("USER RESPONSE:", userData);

    if (!userData.data) {
        return new Response("Failed to fetch Twitter user data", { status: 400 });
    }

    const twitterId = userData.data.id;

    // 4. Encrypt & Save to DB
    await prisma.platformAccount.upsert({
      where: {
        platform_externalId: {
          platform: "TWITTER",
          externalId: twitterId,
        },
      },
      update: {
        // Update tokens if they reconnect
        encryptedAccessToken: encrypt(tokenData.access_token),
        encryptedRefreshToken: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
      create: {
        userId: user.id,
        platform: "TWITTER",
        externalId: twitterId,
        encryptedAccessToken: encrypt(tokenData.access_token),
        encryptedRefreshToken: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
    });

  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error during OAuth", { status: 500 });
  }

  // 5. Success! Back to connections page
  return redirect("/dashboard?success=true");
}