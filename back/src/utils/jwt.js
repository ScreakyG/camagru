import jwt from "jsonwebtoken";
import crypto from "crypto";

// Creer un JWT avec notre secret word et jsonData dans le payload.
export function createJWT(jsonData, options = {}) {
    const token = jwt.sign(jsonData, process.env.JWT_SECRET);
    return (token);
}

export function verifyJWT(token) {
    try
    {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return (verified);
    }
    catch(error)
    {
        console.log("JWT verification failed : ", error.message);
        return (null);
    }
}

export function createValidationToken()
{
    const verificationToken = crypto.randomBytes(32).toString("hex");
    return (verificationToken);
}
