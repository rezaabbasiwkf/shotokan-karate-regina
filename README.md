# Shotokan Karate Regina Website

Professional one-page Next.js website for Shotokan Karate Regina and Coach Reza Abbasi.

## Run On A New Laptop

Install dependencies:

```bash
npm install
```

Build for Vercel:

```bash
npm run build
```

Run locally when you want to preview the site:

```bash
npm run dev
```

## Push To A Friend's GitHub Repo

After copying this folder to the next laptop, run:

```bash
npm install
npm run build
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/FRIEND_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `FRIEND_USERNAME` and `REPO_NAME` with the GitHub account and repository name.

## Deploy With Vercel

1. Push the repository to GitHub.
2. Sign in to Vercel.
3. Import the GitHub repository.
4. Keep the default Next.js settings.
5. Deploy.

### Registration confirmation email

To send the final enrollment email after a student confirms payment, add these environment variables in Vercel (and in `.env.local` for local testing):

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Shotokan Karate Regina <verified-sender@your-domain.com>"
REGISTRATION_EMAIL=club-inbox@your-domain.com
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_rest_token
```

To enable Google Places address suggestions on the registration form, add a browser-restricted Google Maps JavaScript API key with the Places API enabled:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

The PayPal screen uses the provided PayPal QR code. After the payer confirms completion, the site records that confirmation and sends the final registration email. For automatic, provider-verified payment status, a PayPal API/webhook integration and its credentials would be required.

The project is built with the Next.js App Router, TypeScript, Tailwind CSS, and static-friendly content suitable for GitHub and Vercel deployment.

## SEO and Google Indexing

- Confirm the production domain used in the app metadata and Vercel deployment.
- Deploy the site to Vercel and verify the live URLs for /, /sitemap.xml, and /robots.txt.
- Add the site to Google Search Console and verify ownership with the recommended DNS TXT record if required.
- Submit the sitemap and request indexing for the homepage.
- If this is a real local class or business, create or update the Google Business Profile as appropriate.
