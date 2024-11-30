// Third-Party Imports:
import nodemailer from 'nodemailer';

// Local Imports:
import { createConfirmationToken } from "./jsonWebTokenUtils.js";
import { parse } from 'dotenv';

export function checkAuthStatus(req) {
    const { user } = req.session;
    if (user) return { isAuthorized: true, user: user };
    return { isAuthorized: false };
}

export async function sendConfirmationEmail({ id, email, first_name }) {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, CONFIRM_ACCOUNT_LINK } = process.env;
    const confirmationToken = createConfirmationToken({ id, email });
    const confirmationLink = `${CONFIRM_ACCOUNT_LINK}${confirmationToken}`

    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT),
        secure: true,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD
        },
      });

    const emailBody = `Hello ${first_name},\n\nPlease click on the link below to confirm your account:\n\n${confirmationLink}`

    const mail = {
        from: EMAIL_USER,
        to: email,
        subject: '42 Matcha Confirmation Email',
        text: emailBody
    }

    const info = await transporter.sendMail(mail);
    console.log('Email info: ', info);
}
