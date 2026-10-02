# Local search and genuine student enquiries

Technical improvements can help search engines understand the academy. They do not guarantee crawling, rankings, traffic, or enrollment. No paid campaign, artificial traffic, purchased reviews, or new visitor tracker is enabled by this update.

## Implemented in the website

- `/classes` answers local class searches with the supplied location, schedule, tuition, age-group pathways, coach information, and contact options.
- Every public page has its own canonical and matching social metadata. Structured data uses the production domain and documented Schema.org types.
- The sitemap includes public pages and published educational resources/articles; drafts and private account/payment/admin routes are excluded. Static pages do not claim an invented revision date.
- FAQ answers are present in HTML and usable without JavaScript. Navigation connects the class page to registration, academy updates, grading, and education.
- Private and API routes send `X-Robots-Tag: noindex, nofollow`. This is an indexing hint, not access control.
- The public registration email service still needs a separately verified, working endpoint. Calls and the academy email remain alternative enquiry options.

## Owner-side setup after publishing

1. Verify `https://www.karateyqr.com` in [Google Search Console](https://search.google.com/search-console). DNS verification is appropriate for a domain property. For an HTML-tag URL-prefix verification, save only the tag's `content` value as `GOOGLE_SITE_VERIFICATION` in Vercel Production and redeploy; the site emits the tag automatically. Never provide a Google password or session cookie.
2. Submit `https://www.karateyqr.com/sitemap.xml` in Search Console. Inspect the homepage and `/classes` after publishing. Sitemap submission is discovery, not an indexing guarantee.
3. Verify or update the academy's [Google Business Profile](https://www.google.com/business/). Use the real business name, appropriate category, address, telephone, website, and confirmed schedule. Follow Google's rules for a business using a shared training venue; do not invent a staffed office or broader opening hours.
4. Keep profile and website details consistent. Add authentic academy photographs with appropriate student/photo consent. Ask real students or parents for honest reviews, without rewards, filtering out negative reviews, or buying reviews.
5. Link to the class page from the academy's Instagram profile and genuine training/event posts. Seek relevant community links only where there is a real relationship; do not buy keyword-rich backlinks or create duplicate city pages.
6. Publish useful updates based on actual classes, approved events, supplied curriculum, and verified academy information. Do not fabricate news, testimonials, or grading requirements just to create content.

## Measure before claiming growth

Record the Search Console baseline after setup: search clicks, impressions, click-through rate, queries, and landing pages. Compare equivalent periods and review actual phone/email enquiries and successfully received registrations. Separate qualified local interest from unrelated educational traffic. No baseline or traffic-growth result has been measured by this code change.

## Regression check

With a local development server running:

```powershell
npm.cmd run test:seo -- http://localhost:3101
```

The checker fetches only loopback URLs and validates sitemap pages, metadata, JSON-LD, and private-route indexing headers. It does not submit forms or send Google indexing requests.

References: [Google Search Essentials](https://developers.google.com/search/docs/essentials), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and [local ranking guidance](https://support.google.com/business/answer/7091).
