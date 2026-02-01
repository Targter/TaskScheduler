// import { requireUser } from "@/lib/session";
// import { prisma } from "@/lib/db";
// import { encrypt } from "@/lib/crypto";
// import { redirect } from "next/navigation";
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   const user = await requireUser();
//   const code = req.nextUrl.searchParams.get("code");

//   // 1. Get Token
//   const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams({
//       grant_type: "authorization_code",
//       code: code!,
//       redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/oauth/linkedin/callback`,
//       client_id: process.env.LINKEDIN_CLIENT_ID!,
//       client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
//     }),
//   });
  
//   const tokenData = await tokenRes.json();
  
//   // 2. Get User ID (The "sub" field is the LinkedIn URN)
//   const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
//     headers: { Authorization: `Bearer ${tokenData.access_token}` }
//   });
//   const profileData = await profileRes.json();

//   // 3. Save to DB
//   await prisma.platformAccount.upsert({
//     where: {
//       platform_externalId: {
//         platform: "LINKEDIN",
//         externalId: profileData.sub, 
//       },
//     },
//     update: {
//     //   name: profileData.name,
//       encryptedAccessToken: encrypt(tokenData.access_token),
//       // LinkedIn tokens last 60 days
//       expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
//     },
//     create: {
//       userId: user.id,
//       platform: "LINKEDIN",
//       externalId: profileData.sub,
//     //   name: profileData.name,
//       encryptedAccessToken: encrypt(tokenData.access_token),
//       expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
//     },
//   });

//   return redirect("/dashboard/connections?success=linkedin");
// }

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Verify User

  console.log("callebaclakjdfa;ldkfja;ldfkj, linkedin")
  const user = await requireUser();

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle cancellation or missing code
  if (error || !code) {
    console.error("LinkedIn OAuth Error:", error || "No code provided");
    return redirect("/dashboard?error=linkedin_auth_failed");
  }

  try {
    // 2. Exchange Code for Access Token
    // LinkedIn expects client_id/secret in the body for this flow
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded" 
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        // Make sure this MATCHES exactly what you sent in the initial login request
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/oauth/linkedin/callback`, 
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("LinkedIn Token Error:", tokenData);
      return new Response("Failed to fetch tokens from LinkedIn", { status: 400 });
    }

    // 3. Fetch User's LinkedIn Profile
    // We use the OIDC endpoint. The 'sub' field is the stable User ID.
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const profileData = await profileRes.json();

    if (!profileRes.ok) {
        console.error("LinkedIn Profile Error:", profileData);
        return new Response("Failed to fetch LinkedIn user data", { status: 400 });
    }

    // 4. Save to DB
    await prisma.platformAccount.upsert({
      where: {
        platform_externalId: {
          platform: "LINKEDIN",
          externalId: profileData.sub, // 'sub' is the unique ID in OIDC
        },
      },
      update: {
        encryptedAccessToken: encrypt(tokenData.access_token),
        // LinkedIn standard tokens are long-lived (60 days) and often don't return a refresh token.
        // If your schema requires a value, send null.
        encryptedRefreshToken: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
      create: {
        userId: user.id,
        platform: "LINKEDIN",
        externalId: profileData.sub,
        encryptedAccessToken: encrypt(tokenData.access_token),
        encryptedRefreshToken: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
    });

  } catch (error) {
    console.error("LinkedIn OAuth Internal Error:", error);
    return new Response("Internal Server Error during LinkedIn OAuth", { status: 500 });
  }

  // 5. Success Redirect
  return redirect("/dashboard?success=true");
}