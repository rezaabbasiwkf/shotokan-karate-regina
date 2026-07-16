# Karate Knowledge Center administration

The public learning area is available at `/karate-knowledge-center`, with the
refereeing curriculum at `/karate-refereeing` and the searchable document
library at `/karate-refereeing/resources`.

## Production setup

The content manager reuses the website's verified administrator role and
persistent KV database. Large PDFs and featured images use a private Vercel
Blob store so upload credentials and unpublished files are not exposed.

1. Connect a private Blob store to the Vercel project.
2. Confirm that `BLOB_READ_WRITE_TOKEN` is present in the deployment
   environment. `KV_REST_API_URL` and `KV_REST_API_TOKEN` must also be present.
3. Sign in with a verified email listed in `ADMIN_EMAILS`.
4. Open `/admin/knowledge-center`.

Administrator-created content begins as a draft by default. The manager allows
an administrator to preview metadata, upload a PDF or featured image, create an
article, publish, archive, reorder, edit metadata, replace a PDF with a newer
edition, assign keywords, and link related resource IDs. Download and print
controls stay disabled unless permission is explicitly recorded.

## Supplied WKF documents

The initial WKF files are preserved under `public/documents/refereeing`. Their
records are in `src/data/refereeing-resources.ts`; they retain source
attribution and do not display download or print controls. Run
`npm run knowledge:index` after an authorized static PDF is added or replaced.
This regenerates the extracted-text search index without changing the PDF.

Before publishing any resource:

- confirm the title, issuing organization, version, effective date, and source;
- confirm that public display and any download or print option are authorized;
- distinguish official wording from educational explanations and examples;
- set a last-reviewed date and archive superseded editions;
- check the final reader on desktop and mobile.
