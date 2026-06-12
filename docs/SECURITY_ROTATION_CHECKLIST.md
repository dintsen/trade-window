# Security Rotation Checklist

Due to exposure, the following credentials must be rotated:

- [ ] Rotate GitHub PAT (exposed in chat session 2026-06-12)
- [ ] Rotate GitHub PAT embedded in local git remote URL (then run `git remote set-url origin https://github.com/dintsen/trade-window.git` and use a credential helper)
- [ ] Rotate Railway token
- [ ] Rotate Vercel token (exposed in chat session 2026-06-12)
- [ ] Rotate Supabase DB password (exposed in chat session 2026-06-12)

### Post-Rotation Steps

1. After rotating the Supabase DB password, update the `DATABASE_URL` environment variable in Railway.
2. Redeploy the backend service in Railway to pick up the new connection string.
3. Verify the following endpoints are still functioning:
   * `https://trade-window-production.up.railway.app/health`
   * `https://trade-window-production.up.railway.app/api/board/listings`
   * `https://tradewindow.xyz`
   * `https://tradewindow.xyz/board`
   * `https://tradewindow.xyz/request`
   * `https://tradewindow.xyz/trade`
