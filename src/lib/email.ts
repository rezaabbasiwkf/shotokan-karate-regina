export async function sendRegistrationEmail(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const supportEmail = process.env.REGISTRATION_EMAIL || process.env.EMAIL_FROM || "info@shotokan-karate-regina.com";
  const fromEmail = process.env.RESEND_FROM || "Shotokan Karate Regina <onboarding@resend.dev>";
  const applicantEmail = String(payload.emailAddress || "");

  if (!apiKey) {
    console.info("Resend email not configured. Registration saved locally only.");
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
      subject: "New student registration received",
      html: `
        <h2>New student registration submitted</h2>
        <p>A new registration form was completed on the website.</p>
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
        subject: "Your Shotokan Karate registration has been received",
        html: `
          <h2>Thank you for registering</h2>
          <p>Your student registration has been received and is being reviewed by the Shotokan Karate Regina team.</p>
          <p>We will contact you shortly with the next steps.</p>
        `,
      }),
    });
  }

  return { sent: true };
}
