import nodemailer from "nodemailer"

let transporter = null;

export function initEmailService() {
    transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
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

export async function sendValidationMail(user) {
    try
    {
        const info = await transporter.sendMail({
            from : `"Camagru" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Account Verification",
            html: /*html*/
             `<h1>Please click the verification link to verify your account :</h1>
             <a target="_blank" rel="noopener noreferrer" href=http://localhost:8080/api/auth/verify?token=${user.verificationToken}>Verify</a>
             `,
        });

        console.log(`📨 ✅ Validation mail sent to : ${user.email}`);
    }
    catch (error)
    {
        console.log(`📨 ❌ Failed to deliver validation mail to : ${user.email}, because ${error}`);
    }
}
