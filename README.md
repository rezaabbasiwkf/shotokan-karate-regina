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

The project is built with the Next.js App Router, TypeScript, Tailwind CSS, and static-friendly content suitable for GitHub and Vercel deployment.
