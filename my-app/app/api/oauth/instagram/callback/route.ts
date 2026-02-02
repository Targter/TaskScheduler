// import { requireUser } from "@/lib/session";
// import { prisma } from "@/lib/db";
// import { encrypt } from "@/lib/crypto";
// import { redirect } from "next/navigation";
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   console.log("Callback triggered: Instagram");
  
//   // 1. Verify User
//   const user = await requireUser();

//   const { searchParams } = new URL(req.url);
//   const code = searchParams.get("code");
//   const error = searchParams.get("error");

//   console.log("auth Code: ",code)
//   // Handle cancellation or missing code
//   if (error || !code) {
//     console.error("Instagram OAuth Error:", error || "No code provided");
//     return redirect("/dashboard?error=instagram_auth_failed");
//   }

//   try {
//     // ------------------------------------------------------------------
//     // 2. Exchange Code for Short-Lived Access Token (Valid ~1 hour)
//     // ------------------------------------------------------------------
//     const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`;
    
//     const tokenRes = await fetch(tokenUrl);
//     const tokenData = await tokenRes.json();

//     if (!tokenRes.ok) {
//       console.error("Instagram Short-Token Error:", tokenData);
//       return new Response("Failed to fetch short-lived token", { status: 400 });
//     }

//     const shortToken = tokenData.access_token;

//     // ------------------------------------------------------------------
//     // 3. Exchange for Long-Lived Token (Valid ~60 days)
//     // This is crucial for scheduling/automation tools
//     // ------------------------------------------------------------------
//     const longTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${shortToken}`;
    
//     const longTokenRes = await fetch(longTokenUrl);
//     const longTokenData = await longTokenRes.json();

//     if (!longTokenRes.ok) {
//       console.error("Instagram Long-Token Error:", longTokenData);
//       return new Response("Failed to exchange for long-lived token", { status: 400 });
//     }

//     const accessToken = longTokenData.access_token;
//     // Calculate expiration (usually 60 days in seconds)
//     const expiresIn = longTokenData.expires_in || 5184000; 

//     // ------------------------------------------------------------------
//     // 4. Get Pages & Connected Instagram Accounts
//     // We need to find the "Instagram Business ID", not the Facebook Page ID
//     // ------------------------------------------------------------------
//     const pagesUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}&fields=id,name,instagram_business_account`;
//     const pagesRes = await fetch(pagesUrl);
//     const pagesData = await pagesRes.json();

//     if (!pagesRes.ok) {
//       console.error("Instagram Pages Error:", pagesData);
//       return new Response("Failed to fetch user pages", { status: 400 });
//     }

//     // Find the first page that has an Instagram Business Account connected
//     const pageWithIg = pagesData.data.find((p: any) => p.instagram_business_account);

//     if (!pageWithIg) {
//       console.error("No IG Account found in pages:", pagesData);
//       return redirect("/dashboard?error=no_instagram_business_account_found");
//     }

//     const igUserId = pageWithIg.instagram_business_account.id;
//     const pageName = pageWithIg.name;

//     console.log(`Found Instagram Account: ${igUserId} (Page: ${pageName})`);

//     // ------------------------------------------------------------------
//     // 5. Save to DB
//     // ------------------------------------------------------------------
//     await prisma.platformAccount.upsert({
//       where: {
//         platform_externalId: {
//           platform: "INSTAGRAM",
//           externalId: igUserId,
//         },
//       },
//       update: {
//         // If your schema has a 'name' field, uncomment the next line
//         // name: `${pageName} (IG)`, 
//         encryptedAccessToken: encrypt(accessToken),
//         // Instagram doesn't typically provide a separate refresh token in this flow;
//         // the long-lived access token acts as the credential.
//         encryptedRefreshToken: null, 
//         expiresAt: new Date(Date.now() + expiresIn * 1000),
//       },
//       create: {
//         userId: user.id,
//         platform: "INSTAGRAM",
//         externalId: igUserId,
//         // If your schema has a 'name' field, uncomment the next line
//         // name: `${pageName} (IG)`, 
//         encryptedAccessToken: encrypt(accessToken),
//         encryptedRefreshToken: null,
//         expiresAt: new Date(Date.now() + expiresIn * 1000),
//       },
//     });

//   } catch (error) {
//     console.error("Instagram OAuth Internal Error:", error);
//     return new Response("Internal Server Error during Instagram OAuth", { status: 500 });
//   }

//   // 6. Success Redirect
//   return redirect("/dashboard?success=true");
// }

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await requireUser();
  const code = req.nextUrl.searchParams.get("code");

  if (!code) return redirect("/dashboard?error=no_code");

  try {
    // 1. Get Short Token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`;
    
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) throw new Error(tokenData.error.message);
    const shortToken = tokenData.access_token;

    // 2. Get Long Token
    const longTokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${shortToken}`;
    const longTokenRes = await fetch(longTokenUrl);
    const longTokenData = await longTokenRes.json();
    const accessToken = longTokenData.access_token;

    // 3. Get Pages
    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}&fields=id,name,instagram_business_account`;
    
    const pagesRes = await fetch(pagesUrl);
    const pagesData = await pagesRes.json();

    // Debugging: See what Facebook returned
    console.log("Pages found:", JSON.stringify(pagesData));

    const pageWithIg = pagesData.data?.find((p: any) => p.instagram_business_account);

    if (!pageWithIg) {
      console.error("No IG Account found in pages:", pagesData);
      // We return here to avoid hitting the catch block with a redirect
      return redirect("/dashboard?error=no_instagram_business_account_found");
    }

    const igUserId = pageWithIg.instagram_business_account.id;
    
    // 4. Save to DB
    await prisma.platformAccount.upsert({
      where: {
        platform_externalId: {
          platform: "INSTAGRAM",
          externalId: igUserId,
        },
      },
      update: {
        encryptedAccessToken: encrypt(accessToken),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 
      },
      create: {
        userId: user.id,
        platform: "INSTAGRAM",
        externalId: igUserId,
        encryptedAccessToken: encrypt(accessToken),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    });

  } catch (error) {
    console.error("Instagram OAuth Internal Error:", error);
    return redirect("/dashboard?error=instagram_connection_failed");
  }

  // 5. Success Redirect (MUST BE OUTSIDE TRY/CATCH)
  return redirect("/dashboard/connections?success=instagram");
}