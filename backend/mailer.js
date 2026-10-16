/**
 * Email notification stub. Wire this to Resend/SendGrid/SES/Postmark
 * (see spec Section 79 for SPF/DKIM/DMARC setup so mail doesn't land in
 * spam). Kept as a no-op logger so the starter has no external
 * dependency or API key requirement out of the box.
 */
export async function notify(subject, body) {
  console.log(`[email:notify] ${subject}`);
  console.log(body);
  // Example real implementation with Resend:
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@kemilshah.com',
  //   to: process.env.NOTIFY_EMAIL,
  //   subject,
  //   text: body,
  // });
}
