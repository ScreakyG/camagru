import { AuthenticationError } from "./errors.js";
import { verifyJWT } from "./jwt.js";

export function requireAuth(request, reply, done) {
    const token = request.cookies.auth_token;
    if (!token)
        throw new AuthenticationError("Could not find auth_token in cookies")

    const decodedToken = verifyJWT(token);
    if (!decodedToken)
        throw new AuthenticationError("Auth_token is invalid/expired");

    request.user = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email
    };

    done();
}
