export function resendValidationMail(request, reply) {
    reply.send({success: true, message: "Send you new link via mail"});
}
