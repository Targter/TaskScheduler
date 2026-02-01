import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET() {
  await requireUser();

  const clientId = process.env.FACEBOOK_APP_ID!;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback`;
  
  // Permissions needed for scheduling
  // const scope = "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement"; 

   const scope = [
    "pages_show_list",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_content_publish",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    response_type: "code",
    state: crypto.randomUUID(), // 🔐 important
  });

  const url = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;

  console.log("Facebook OAuth URL:", url);



  // const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  // console.log("url:",url)

  return redirect(url);
}