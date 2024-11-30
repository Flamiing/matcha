// Third-Party Imports:
import nodemailer from 'nodemailer';

// Local Imports:
import { createConfirmationToken } from './jsonWebTokenUtils.js';

export function checkAuthStatus(req) {
    const { user } = req.session;
    if (user) return { isAuthorized: true, user: user };
    return { isAuthorized: false };
}

export async function sendConfirmationEmail({
    id,
    email,
    username,
    first_name,
}) {
    const { CONFIRM_ACCOUNT_LINK } = process.env

    const confirmationToken = createConfirmationToken({
        id,
        email,
        username,
        first_name,
    });
    const confirmationLink = `${CONFIRM_ACCOUNT_LINK}${confirmationToken}`;

    const subject = '42 Matcha Confirmation Email';
    const body = `Hello ${first_name},\n\nPlease click on the link below to confirm your account:\n\n${confirmationLink}`;

    await sendEmail(email, subject, body);

}

async function sendEmail(email, subject, body) {
    const {
        EMAIL_HOST,
        EMAIL_PORT,
        EMAIL_USER,
        EMAIL_PASSWORD,
    } = process.env;

    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT),
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        },
    });

    const mail = {
        from: EMAIL_USER,
        to: email,
        subject: subject,
        text: body,
    };

    const info = await transporter.sendMail(mail);
    console.log('Email info: ', info);
}
