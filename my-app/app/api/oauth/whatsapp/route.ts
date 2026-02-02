import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Ensure user is logged in
  await requireUser();

  const clientId = process.env.META_CLIENT_ID!;
  const configId = process.env.META_CONFIG_ID!; // Generated in Meta Dev Portal > Facebook Login for Business > Configurations
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/whatsapp/callback`;

  // 2. Build Auth URL
  // Meta uses v20.0 (or current version)
  const url = new URL("https://www.facebook.com/v20.0/dialog/oauth");
  
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUri);
  
  // Instead of passing a list of scopes manually, Meta recommends 'config_id' 
  // for WhatsApp Business (this groups whatsapp_business_management, etc.)
  url.searchParams.append("config_id", configId);
  
  url.searchParams.append("response_type", "code");
  
  // State parameter for security (CSRF protection)
  // In production, match your Twitter logic (random string stored in cookie)
  url.searchParams.append("state", "state_whatsapp_connection"); 
  
  return redirect(url.toString());
}