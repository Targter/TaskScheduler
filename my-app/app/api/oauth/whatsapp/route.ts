import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET() {
  await requireUser();

  const clientId = process.env.FACEBOOK_APP_ID!;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/whatsapp/callback`;
  
  // Specific WhatsApp Scopes
  const scope = [
    "whatsapp_business_management",
    "whatsapp_business_messaging"
  ].join(",");

  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

  return redirect(url);
}