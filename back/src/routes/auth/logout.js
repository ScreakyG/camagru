import { verifyJWT } from "../../utils/jwt.js";

export async function logout(request, reply) {
    // Enleve le JWT dans les cookies.
    const token = request.cookies.auth_token;
    if (!token || !verifyJWT(token))
        return (reply.code(401).send({success: false, message: "Not authenticated"}));

    reply.clearCookie("auth_token", {
        path: "/",
        httpOnly: true,
        sameSite: "strict"
    });
    return (reply.code(200).send({success: true, message: "Logged out user"}));
}
