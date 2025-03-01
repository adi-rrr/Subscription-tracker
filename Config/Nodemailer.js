import nodemailer from 'nodemailer'; 
import { EMAIL_PASSWORD } from './Env.js';
export const accountEmail = 'adithyacr713@gmail.com';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
})

export default transporter;