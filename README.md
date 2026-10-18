# HUBB — joinhubb.online

A luxury, minimal, mobile-friendly landing page for the Arab & English Discord community HUBB.

## Included
- `index.html` — site structure, wording, navigation, metadata, owner profiles (Kay, Ani, MJ), joining Discord
- `styles.css` — the whole cream/white/beige design and responsive layout
- `script.js` — mobile navigation, scroll reveal, and real Discord counts
- `netlify/functions/server-stats.mjs` — server-side fetch for **approximate** total members and online members (no private bot token)
- `netlify.toml` — routes `/api/stats` to the function
- `assets/` — favicon and social sharing cover

## Preview locally
- For the static page, run `python -m http.server 8000` in this folder and open http://localhost:8000.
- **Live stats only work after deploying to Netlify (or another host supporting a compatible server-side endpoint).** In static previews, stats intentionally show 'Temporarily unavailable', rather than invented data.

## Publish for FREE using Netlify (recommended)
1. Create a free account at https://app.netlify.com/ .
2. Best approach for live counts: upload this website folder into a **GitHub repository**, then in Netlify choose **Add new project > Import an existing project**, connect GitHub, and select the repository. Netlify reads `netlify.toml` and deploys the serverless function.
3. No build command or npm install is needed. The publish directory is `.` (project root).
4. Open your Netlify site URL, click **Join Hubb**, and confirm the live member counts. The stats endpoint is `https://YOUR-SITE.netlify.app/api/stats`.
5. In **Netlify > Domain management**, add `joinhubb.online` as a domain you already own.
6. In GoDaddy's DNS settings, add/change the records exactly as Netlify's domain setup page specifies. As an example only, typical external DNS setup is an A record for `@` and a CNAME for `www`; **use the values shown in your own Netlify dashboard**. Do not delete existing email/MX records.
7. Allow DNS and HTTPS to finish verifying. Test both `https://joinhubb.online` and `https://www.joinhubb.online`.

**Note:** Just owning a domain at GoDaddy doesn't automatically provide hosting. You can leave the domain registration at GoDaddy while hosting the website on Netlify.

## Customizing
- Button destinations: search `https://discord.gg/hubb` in `index.html`.
- Owner names: edit cards within `<section class="owners">` in `index.html`.
- Fonts: DM Sans + Cormorant Garamond + Noto Naskh Arabic are imported from Google Fonts; system fonts are fallbacks.
- Palette: change the CSS variables at the top of `styles.css`.
- Social preview: `assets/og-cover.png`.

## Live Discord data
`GET /api/stats` requests the public Discord invite endpoint with `with_counts=true`. Discord provides **approximate** counts, not exact counts. They may be unavailable if the vanity invite is changed, Discord blocks the request, or the host doesn't support serverless functions. In that case the UI shows a graceful unavailable state. It never fabricates numbers.

## License
Original Hubb website assets and code are provided for use on this server's own website.
