# Registration Portal Architecture

The portal stores versioned collections named `accounts`, `students`, `emergency_contacts`, `classes`, `class_sessions`, `enrollments`, `payments`, `waiver_acceptances`, `email_delivery_logs`, and `trial_requests`. Supporting private collections are `sessions`, `secure_tokens`, `receipts`, `audit_logs`, and `rate_limits`.

Production persistence uses an Upstash/Vercel KV-compatible REST service. Database mutations use compare-and-set version checks and retry when another request updates the database concurrently. Local development uses an ignored JSON database file. Production refuses local-file fallback.

Enrollment records contain the required fields: `id`, `registrationReference`, `accountId`, `studentId`, `classId`, `enrollmentStatus`, `paymentStatus`, `waiverAcceptedAt`, `createdAt`, and `updatedAt`, plus session and tuition snapshots. The initial statuses are `Pending Payment` and `Not Paid`.

The enrollment sequence is:

1. Validate the visible form.
2. Validate ownership, waiver, class capacity, duplicates, and active session on the server.
3. Save the enrollment.
4. Generate a unique `REG-YYYY-######` reference.
5. Return `{ success, registrationReference, paymentUrl }` (with a saved-review URL for the browser).
6. The family reviews the saved reference and continues to Payment.
7. Administrator and family email jobs run separately from the database mutation.

Payment submission never confirms a PayPal transaction automatically. Family submission sets `Pending Verification` / `Payment Submitted`; an authenticated administrator action sets `Confirmed` / `Active` and queues the family confirmation email.

Never commit `.env.local`, production database exports, receipt files, API credentials, or session/token values.
