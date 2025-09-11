import { findUserByEmail, insertTokenDatabase } from "../../models/querys.js";
import { createValidationToken } from "../../utils/jwt.js";
import { sendPasswordResetMail } from "../../services/mailService.js";
import { hashToken } from "../../utils/encrypt.js";
import { setExpirationDate } from "../../utils/time.js";
import { BadRequestError } from "../../utils/errors.js";
import { verifyEmailInput } from "../../validators/validation_rules.js";

export async function forgotPassword(request, reply) {
    try
    {
        if (!request.body)
            throw new BadRequestError("Missing body content in request.");

        let { email } = request.body;

        email = verifyEmailInput(email);

        const user = await findUserByEmail(email);
        if (user && user.is_verified)
        {
            const token = createValidationToken();
            const hash = hashToken(token);

            await insertTokenDatabase(user.id, hash, setExpirationDate(15), "reset_password");
            await sendPasswordResetMail(user, token);
        }
        return reply.send({success: true, message: "If an account exist check your emails."});
    }
    catch (error)
    {
        if (error.statusCode)
            return reply.code(error.statusCode).send({success: false, message: error.message});
        else
            return reply.code(500).send({success: false, message: error.message});
    }
}
