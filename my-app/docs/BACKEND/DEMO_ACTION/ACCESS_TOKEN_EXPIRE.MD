Do users need to reconnect again and again?
❌ NO (bad UX)

If users had to reconnect daily, your app would be unusable.

✅ YES (only if refresh fails)

Only when:

Refresh token is revoked

User removed app access from X

Token rotation fails

Worker wants to post
↓
Try API with access token
↓
If 401 / 403 (expired)
↓
Use refresh token
↓
Get new access token
↓
Save new token in DB
↓Retry post
Do users need to reconnect again and again?
❌ NO (bad UX)
If users had to reconnect daily, your app would be unusable.
✅ YES (only if refresh fails)

Only when:
Refresh token is revoked
User removed app access from X
Token rotation fails

Even better:
Refresh 1–5 minutes before expiry

<!--  -->

What you should do NEXT (clear steps)

Add expiresAt handling if missing
Implement refreshAccessToken() function
Call it in worker before posting
Update DB with new token
