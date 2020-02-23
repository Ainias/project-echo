
import * as nodemailer from "nodemailer";
import {Helper} from "js-helper/dist/shared/Helper";

export class ContactController {
    static async sendContactMail(req, res){

        let emailadress = req.body.email;
        let message = req.body.message;
        let hasAcceptedPolicy = req.body.policy;

        if (hasAcceptedPolicy !== "1"){
            return res.json({success: false, message: "policy must be accepted!"});
        }
        if (Helper.isNull(message) || message.trim() === ""){
            return res.json({success: false, message: "message must be submitted!"});
        }
        if (Helper.isNull(emailadress)){
            return res.json({success: false, message: "email must be submitted!"});
        }

        let atIndex = emailadress.indexOf("@");
        if (atIndex === -1 || atIndex === emailadress.length-1){
            return res.json({success: false, message: "email is not valid"});
        }

        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: Helper.nonNull(process.env.EMAIL_SECURE, "1") !== "0",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                ciphers:'SSLv3'
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.CONTACT_EMAIL,
            replyTo: emailadress,
            subject: "[echo][contact] Nachricht über das Kontaktformular",
            text:"Von: "+emailadress+"\n\n"+ message+"\n\n\n-------------\n\n Diese Nachricht wurde über ein Kontaktformular automatisiert gesendet. Zum Antworten an "+emailadress+" druücke auf Antworten.",
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info);
                }
            })
        });

        res.json({success: true});
    }
}