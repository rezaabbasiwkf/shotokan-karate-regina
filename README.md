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

### Family account, enrollment, payment, and email portal

The site includes a secure family portal at `/account` and a streamlined student form at `/register`. Both workflows connect to private payment receipt storage, manual PayPal verification, a role-protected administrator dashboard, consent records, email-delivery logs, and audit logs.

Copy `.env.example` to `.env.local` for local development. Configure these variables in Vercel before enabling production registrations:

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="SHOTOKAN Karate Regina <verified-sender@your-domain.com>"
REGISTRATION_EMAIL=reza.abbasi.wkf@gmail.com
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_rest_token
ADMIN_EMAILS=reza.abbasi.wkf@gmail.com
NEXT_PUBLIC_SITE_URL=https://shotokan-karate-regina.vercel.app
APP_BASE_URL=https://shotokan-karate-regina.vercel.app
ADMIN_NOTIFICATION_EMAIL=reza.abbasi.wkf@gmail.com
```

`KV_REST_API_URL` and `KV_REST_API_TOKEN` are mandatory in production. The app intentionally refuses production writes when persistent database configuration is missing; it does not silently use Vercel’s ephemeral filesystem. Local development uses `data/portal-database.json`, or a different ignored filename inside `data/` specified by `PORTAL_DATABASE_FILE`.

The project already used an Upstash/Vercel KV-compatible persistent store, so this repair extends that database instead of introducing an unrelated SQL service. `EMAIL_API_KEY`/`EMAIL_FROM_ADDRESS` may be used as aliases for `RESEND_API_KEY`/`RESEND_FROM`.

Production API routes are `POST /api/registrations`, `POST /api/payments/confirm`, and owner-protected `GET /api/registrations/[reference]/summary`. The reference in a URL is not authorization; streamlined registrants receive a separate HTTP-only access cookie.

Accounts whose normalized email is listed in `ADMIN_EMAILS` receive the `admin` role. The account must still verify its email before `/admin` and administrator APIs are available. Public families are restricted to records with their own `accountId`; private receipts perform the same ownership/role check.

Passwords are salted and hashed with Node.js scrypt. Session cookies are HTTP-only, Secure in production, SameSite=Lax, and expire after 14 days. State-changing requests require a same-origin CSRF token. Verification links expire after 24 hours; password-reset links expire after one hour. Rate limits, honeypot spam checks, server-side validation, sanitization, security headers, consent versions, IP records where appropriate, and audit logs are built in.

The PayPal QR code is rendered only on `/payment`. Submitting a transaction reference changes payment to `Pending Verification` and enrollment to `Payment Submitted`. Only an administrator can change them to `Confirmed` and `Active`. The current implementation intentionally does not claim automatic PayPal verification.

Email delivery runs after database commits and is logged independently. A missing or failed email provider never cancels a saved account, trial request, enrollment, or payment submission.

Run the automated portal journey against an isolated temporary database:

```bash
npm run test:portal
```

The test covers account creation, minor/adult streamlined registration, conditional guardian and medical fields, minimum age, invalid email, missing waiver, idempotent duplicate clicks, private summary access, account and streamlined payments, receipt upload, confirmation pages, failed/unconfigured email delivery, password reset, trial requests, administrator verification, and active status.

The project is built with the Next.js App Router, TypeScript, Tailwind CSS, and static-friendly content suitable for GitHub and Vercel deployment.

## SEO and Google Indexing

- Confirm the production domain used in the app metadata and Vercel deployment.
- Deploy the site to Vercel and verify the live URLs for /, /sitemap.xml, and /robots.txt.
- Add the site to Google Search Console and verify ownership with the recommended DNS TXT record if required.
- Submit the sitemap and request indexing for the homepage.
- If this is a real local class or business, create or update the Google Business Profile as appropriate.
