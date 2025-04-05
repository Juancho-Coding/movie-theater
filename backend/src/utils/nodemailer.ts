import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

export function createEmailTransporter() {
  const options = {
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_API_KEY,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
  transporter = nodemailer.createTransport(options);
}

export default async function sendEmail(
  name: string,
  email: string,
  movie: string,
  time: string,
  file: Buffer<ArrayBufferLike> | undefined
) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    attachments: [
      {
        // binary buffer as an attachment
        filename: "tickets.pdf",
        content: file,
      },
    ],
    from: `Your Movie Cinema <${email}>`,
    to: email, // list of receivers
    subject: `Here are your ticket for the movie ${movie}, enjoy`, // Subject line
    text: `Hey ${name}!
    Your movie night is officially ON! 🙌
    We’ve locked in your seats, dimmed the lights (okay, not really), and attached your tickets to this email.

    Here’s what you’ve got:
    🎥 Movie: ${movie}
    ⏰ Date and time: ${time}

    Just flash the attached ticket at the entrance — phone or print, your choice!
    Got questions? Need snacks recommendations? (We vote popcorn 🍿 and gummy bears 🐻). Just hit reply!
    Now sit back, relax, and get ready for the show
    ✨ Enjoy the movie magic!
    Cheers,`, // plain text body
  });
}
