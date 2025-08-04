import { getDB } from "./db.js";
import { ConflictError } from "../utils/errors.js";
import { encryptPassword } from "../utils/encrypt.js";
import { createValidationToken } from "../utils/jwt.js";

export async function createUser(email, username, password) {

    // Ajouter le cas ou le mail et le username sont tout les 2 deja pris ? Pour gerer l'UI cote client.

    // We check if email is not already used.
    const emailTaken = await findUserByEmail(email);
    if (emailTaken)
        throw new ConflictError("This email is already taken");

    // We check if the username is not already used.
    const usernameTaken = await findUserByUsername(username);
    if (usernameTaken)
        throw new ConflictError("This username is already taken");

    //Encrypt the password.
    const hashPass = await encryptPassword(password);

    // Create verification account token
    const verificationToken = createValidationToken();

    const db = await getDB();
    const query = "INSERT INTO users (email, username, password, verification_token) VALUES (?, ?, ?, ?)";
    const result = await db.run(query, [email, username, hashPass, verificationToken]);

    // We return the id that was used to store in DB and also the users infos.
    return ({id: result.lastID, email, username, created_at: new Date().toISOString(), verificationToken});
}

export async function findUserByEmail(email) {
    const db = await getDB();
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await db.get(query, [email]);

    return (result);
}

export async function findUserByUsername(username) {
    const db = await getDB();
    const query = "SELECT * FROM users WHERE username = ?";
    const result = await db.get(query, [username]);

    return (result);
}

export async function findUserByValidationToken(token) {
    const db = await getDB();
    const query = "SELECT * FROM users WHERE verification_token = ?";
    const result = await db.get(query, [token]);

    return (result);
}

export async function setVerifiedUser(user) {
    const db = await getDB();
    const query = "UPDATE users SET isVerified = 1, verification_token = NULL WHERE id = ?";
    const result = await db.run(query, [user.id]);
}
