import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { templates } from './EmailTemplates.js';

dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: 'gmail',
    auth: {
        user: "guruvishnu632@gmail.com",
        pass: "kmtljqvggidlsirw"
    }
});

const sendEmail = (eTo,eSubject,templateName,data)=>{

    const templateFunction = templates[templateName];
    if (!templateFunction) {
        throw new Error(`Template '${templateName}' not found.`);
    }

    const body = templateFunction(data)
    const mailOptions = {
        from: 'fiqbal997@gmail.com',
        to: eTo.email,
        subject: eSubject,
        html: body
    };
    
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        })
    });
}


export{sendEmail}