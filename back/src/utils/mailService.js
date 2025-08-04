import nodemailer from "nodemailer"

let transporter = null;

export function initEmailService() {
    transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

export async function emailServiceStatus() {
    try
    {
        await transporter.verify();
        console.log("📨 Email service working ! ✅");
    }
    catch (error)
    {
        console.log("📨 ❌ Email service not working : ", error);
    }
}

export async function sendValidationMail(emailTarget) {
    try
    {
        const info = await transporter.sendMail({
            from: '"Camagru Admin" <camagru@example.com',
            to: emailTarget,
            subject: "Account Verification",
            text: "Please click the verification link to verify your account."
        });

        console.log(`📨 ✅ Validation mail sent to : ${emailTarget}`);
    }
    catch (error)
    {
        console.log(`📨 ❌ Failed to deliver validation mail to : ${emailTarget}, because ${error}`);
    }
}
