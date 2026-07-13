export async function sendPaymentConfirmationEmail(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const supportEmail = process.env.REGISTRATION_EMAIL || process.env.EMAIL_FROM || "info@shotokan-karate-regina.com";
  const fromEmail = process.env.RESEND_FROM || "Shotokan Karate Regina <onboarding@resend.dev>";
  const applicantEmail = String(payload.emailAddress || "");

  if (!apiKey) {
    console.info("Resend email not configured. Payment confirmation saved locally only.");
    return { sent: false, reason: "missing-resend-config" };
  }

  const formattedFields = Object.entries(payload)
    .filter(([, value]) => value !== "" && value !== false && value !== null)
    .map(([key, value]) => `<li><strong>${key.replace(/([A-Z])/g, " $1")}</strong>: ${String(value)}</li>`)
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [supportEmail],
      subject: "Student payment confirmation received",
      html: `
        <h2>Student registration and payment confirmation</h2>
        <p>A student has completed the registration form and confirmed their tuition payment.</p>
        <ul>${formattedFields}</ul>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed: ${response.status}`);
  }

  if (applicantEmail) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [applicantEmail],
        subject: "Your Shotokan Karate registration is complete",
        html: `
          <h2>Thank you for registering with Shotokan Karate Regina</h2>
          <p>We have received your registration and payment confirmation.</p>
          <p>Your next step is to attend your first class on Wednesday from 4:00 PM to 5:00 PM at 1751 Broad Street, Regina. Please contact Coach Reza Abbasi at 306-570-3125 if you have any questions.</p>
        `,
      }),
    });
  }

  return { sent: true };
}
