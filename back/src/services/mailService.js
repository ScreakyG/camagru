import nodemailer from "nodemailer"

let transporter = null;

export function initEmailService() {
    transporter = nodemailer.createTransport({
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

export async function sendValidationMail(user, token) {
    // TODO: Changer pour le bon lien.
    try
    {
        const info = await transporter.sendMail({
            from : `"Camagru" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Account Verification",
            html: /*html*/
             `<h1>Please click the verification link to verify your account :</h1>
             <a target="_blank" rel="noopener noreferrer" href=http://localhost:8080/api/auth/verify?token=${token}>Verify</a>
             `,
        });

        console.log(`📨 ✅ Validation mail sent to : ${user.email}`);
    }
    catch (error)
    {
        console.log(`📨 ❌ Failed to deliver validation mail to : ${user.email}, because ${error}`);
    }
}

export async function sendPasswordResetMail(user, token) {
    try
    {
            const info = await transporter.sendMail({
            from : `"Camagru" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset Password",
            html: /*html*/
             `<h1>Please click the link to reset your password :</h1>
             <a target="_blank" rel="noopener noreferrer" href=http://localhost:8080/api/auth/validate-reset-link?token=${token}>Reset Password</a>
             `,
        });

        console.log(`📨 ✅ Reset password mail sent to : ${user.email}`);
    }
    catch (error)
    {
        console.log(`📨 ❌ Failed to deliver reset password mail to : ${user.email}, because ${error}`);
    }
}

export async function sendCommentNotificationMail(user) {
    try
    {
            const info = await transporter.sendMail({
            from : `"Camagru" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "New comment on your post !",
            html: /*html*/
             `<h1>One of your post received a new comment, connect to Camagru to check ! :</h1>`
        });

        console.log(`📨 ✅ Notification mail sent to : ${user.email}`);
    }
    catch (error)
    {
        console.log(`📨 ❌ Failed to deliver notification mail to : ${user.email}, because ${error}`);
    }
}
