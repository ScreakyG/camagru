import { BadRequestError } from "../../utils/errors.js";
import { verifyPasswordInput } from "../../validators/validation_rules.js";

export async function modifyPassword(request, reply) {
    try
    {
        if (!request.body)
            throw new BadRequestError("Missing body in request.");

        let { newPassword } = request.body;
        newPassword = verifyPasswordInput(newPassword);

         return ({success: true, message: "Password successfully changed.,", newPassword: newPassword});
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.code(500).send({success: false, errorMessage: "Internal server error", details: error.message}));
    }
}
