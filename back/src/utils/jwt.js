import jwt from "jsonwebtoken";

// Key servant pour crypter le jwt.
const secretKey = "test";

// Creer un JWT avec notre secret word et jsonData dans le payload.
export function createJWT(jsonData, options = {}) {
    const token = jwt.sign(jsonData, secretKey);
    return (token);
}

export function verifyJWT(token) {
    try
    {
        const verified = jwt.verify(token, secretKey);
        return (verified);
    }
    catch(error)
    {
        console.log("JWT verification failed : ", error.message);
        return (null);
    }
}
