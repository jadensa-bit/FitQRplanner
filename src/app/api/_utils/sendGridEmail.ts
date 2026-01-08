import sgMail from '@sendgrid/mail';

export async function sendIntakeEmail({ customerName, customerEmail, notes, planId }: {
  customerName?: string;
  customerEmail?: string;
  notes?: string;
  planId?: string;
}) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  await sgMail.send({
    to: process.env.NOTIFY_EMAIL!,
    from: process.env.NOTIFY_EMAIL!, // must match verified sender
    subject: `New FitQR Purchase: ${planId}`,
    text: `New order received!\n\nName: ${customerName}\nEmail: ${customerEmail}\nPlan: ${planId}\nNotes: ${notes}`,
  });
}
