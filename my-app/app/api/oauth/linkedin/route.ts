import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET() {
  await requireUser();

  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/linkedin/callback`;
  
  // Scopes for Posting + Reading Profile ID
  const scope = "openid profile w_member_social email"; 

  const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("scope", scope);
  url.searchParams.append("state", "random_state_string");
    console.log("redisrtecte;lk;lkajdf")
  return redirect(url.toString());
}