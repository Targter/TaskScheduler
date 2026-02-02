// import { requireUser } from "@/lib/session";
// import { redirect } from "next/navigation";

// export async function GET() {
//   await requireUser();

//   const clientId = process.env.FACEBOOK_APP_ID!;
//   const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback`;
  
//   // Permissions needed for scheduling
//   const scope = "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish"; 
//   // "instagram_basic",
//   // "instagram_content_publish",
//   // "pages_show_list",
//   // "pages_read_engagement",
// // instagram_basic,instagram_content_publish,
//   const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

//   return redirect(url);
// }


import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET() {
  await requireUser();

  const clientId = process.env.FACEBOOK_APP_ID!;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback`;

  // ONLY Facebook-allowed scopes
  const scope = [
    "pages_show_list",
    "pages_read_engagement"
  ].join(",");

  const url =
    `https://www.facebook.com/v18.0/dialog/oauth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&response_type=code`;

  return redirect(url);
}
