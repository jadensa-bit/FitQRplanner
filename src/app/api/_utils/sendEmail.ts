import nodemailer from "nodemailer";

export async function sendIntakeEmail({ customerName, customerEmail, notes, planId }: {
  customerName?: string;
  customerEmail?: string;
  notes?: string;
  planId?: string;
}) {
  // Configure your SMTP transport (use environment variables for security)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `FitQR Orders <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New FitQR Purchase: ${planId}`,
    text: `New order received!\n\nName: ${customerName}\nEmail: ${customerEmail}\nPlan: ${planId}\nNotes: ${notes}`,
  };

  await transporter.sendMail(mailOptions);
}
