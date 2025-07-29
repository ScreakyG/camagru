import jwt from "jsonwebtoken";

// Key servant pour crypter le jwt.
const secretKey = "test";

// Creer un JWT avec notre secret word et jsonData dans le payload.
export function createJWT(jsonData, options = {}) {
    try
    {
        const token = jwt.sign(jsonData, secretKey);
        return (token);
    }
    catch (error)
    {
        console.log("JWT Creation failed : ", error.message);
        return (null);
    }
}
