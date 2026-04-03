const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const send = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Legal Olympiad" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await send({
    to: email,
    subject: "Verify your Legal Olympiad account",
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${url}" style="background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  });
};

const sendPasswordResetEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await send({
    to: email,
    subject: "Reset your Legal Olympiad password",
    html: `
      <h2>Hi ${name},</h2>
      <p>You requested a password reset. Click below to set a new password:</p>
      <a href="${url}" style="background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0">
        Reset Password
      </a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

const sendWebinarReminder = async (email, name, webinar) => {
  await send({
    to: email,
    subject: `Reminder: "${webinar.title}" starts soon`,
    html: `
      <h2>Hi ${name},</h2>
      <p>Your webinar is starting soon!</p>
      <h3>${webinar.title}</h3>
      <p><strong>Date:</strong> ${new Date(webinar.scheduledAt).toLocaleString()}</p>
      ${webinar.platformLink ? `<a href="${webinar.platformLink}" style="background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0">Join Webinar</a>` : ""}
    `,
  });
};

const sendCompetitionConfirmation = async (email, name, competition) => {
  await send({
    to: email,
    subject: `Registration Confirmed: ${competition.title}`,
    html: `
      <h2>Hi ${name},</h2>
      <p>You have successfully registered for:</p>
      <h3>${competition.title}</h3>
      <p><strong>Start Date:</strong> ${new Date(competition.startDate).toDateString()}</p>
      <p><strong>Type:</strong> ${competition.type.replace("_", " ")}</p>
      <p>Good luck!</p>
    `,
  });
};

module.exports = {
  send,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWebinarReminder,
  sendCompetitionConfirmation,
};