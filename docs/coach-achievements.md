# Coach achievement archive management

The public archive at `/coach-achievements` is driven by
`src/data/coach-achievements.ts`. This keeps the presentation separate from the
records, so new documents do not require a page redesign.

## Add or replace a record

1. Review every image before publication. Remove or blur private identification
   numbers, home addresses, birth dates, private contact details, and personal
   signatures that are not required to authenticate the award.
2. Place the reviewed image in `public/images/coach-achievements/`. Use a short,
   descriptive lowercase filename. Keep the source proportions and enough
   resolution for the document text to remain readable.
3. Add a typed record to `coachAchievements` in
   `src/data/coach-achievements.ts`. Transcribe only details that can be verified
   from the document or another reliable source. Leave optional fields out when
   the information is unavailable.
4. Run `npm run lint` and `npm run build`, then inspect the card and enlarged
   document on desktop and mobile before publishing.

Use `display_order` to reorder records (lower numbers appear first), `featured`
to flag records for future featured views, and `visible: false` to hide an entry
without deleting it. Replace the path in `certificate_image` to replace a scan.
The optional `medal_image` and `competition_photo` fields accept related image
paths and are ready for those assets when available.

Filters are generated from published records. A filter is not shown until at
least one visible record matches it.
