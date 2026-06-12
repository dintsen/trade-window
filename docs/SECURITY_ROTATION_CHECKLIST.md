# Security Rotation Checklist

Due to exposure, the following credentials must be rotated:

- [ ] Rotate GitHub PAT
- [ ] Rotate Railway token
- [ ] Rotate Vercel token
- [ ] Rotate Supabase DB password

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
