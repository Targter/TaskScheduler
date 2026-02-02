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
    // 1. Exchange Code for Access Token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/oauth/whatsapp/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) throw new Error(tokenData.error.message);
    const accessToken = tokenData.access_token;

    // 2. Fetch WhatsApp Business Accounts (WABA)
    const wabaUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`;
    // Note: Usually we fetch Businesses, but for Cloud API we often query phone numbers directly via the WABA ID.
    // Let's try fetching the user's granular scopes or IDs.
    
    // Easier Method: Get the Business Account ID first
    const meRes = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`);
    const meData = await meRes.json();

    // 3. Find Phone Numbers
    // We need to find a WABA ID first. This is tricky with standard scopes. 
    // We will attempt to get businesses.
    const businessesRes = await fetch(`https://graph.facebook.com/v18.0/me/businesses?access_token=${accessToken}`);
    const businessesData = await businessesRes.json();

    let phoneNumberId = null;
    let phoneNumberName = "WhatsApp";

    // Loop through businesses to find a phone number
    if (businessesData.data && businessesData.data.length > 0) {
        const businessId = businessesData.data[0].id;
        
        // Fetch Phone Numbers for this Business
        const phonesRes = await fetch(`https://graph.facebook.com/v18.0/${businessId}/phone_numbers?access_token=${accessToken}`);
        const phonesData = await phonesRes.json();

        if (phonesData.data && phonesData.data.length > 0) {
            phoneNumberId = phonesData.data[0].id;
            phoneNumberName = phonesData.data[0].display_phone_number;
        }
    }

    // FALLBACK: If above fails (permissions issue), user might need to input ID manually in settings.
    // But for now, let's assume we found it or fail gracefully.
    
    if (!phoneNumberId) {
        // For MVP, if we can't auto-discover, we might redirect to a manual entry page.
        // But let's try to error out for now.
        console.error("No WhatsApp Number Found", businessesData);
        return redirect("/dashboard/connections?error=no_whatsapp_number");
    }

    // 4. Save to DB
    await prisma.platformAccount.upsert({
      where: {
        platform_externalId: {
          platform: "WHATSAPP",
          externalId: phoneNumberId,
        },
      },
      update: {
        // name: `${phoneNumberName} (WA)`,
        encryptedAccessToken: encrypt(accessToken),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      create: {
        userId: user.id,
        platform: "WHATSAPP",
        externalId: phoneNumberId,
        // name: `${phoneNumberName} (WA)`,
        encryptedAccessToken: encrypt(accessToken),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    });

  } catch (error) {
    console.error("WhatsApp OAuth Error:", error);
    return redirect("/dashboard/connections?error=whatsapp_failed");
  }

  return redirect("/dashboard/connections?success=whatsapp");
}