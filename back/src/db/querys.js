import { getDB } from "./db.js";
import { ConflictError } from "../utils/errors.js";

export async function createUser(email, username, password) {

    // Ajouter le cas ou le mail et le username sont tout les 2 deja pris ? Pour gerer l'UI cote client.

    // We check if email is not already used.
    const userExists = await findUserByEmail(email);
    if (userExists)
        throw new ConflictError("This email is already taken");

    // We check if the username is not already used.
    // const usernameTaken = await findUserByUsername(username);
    // if (usernameTaken)
    //     throw new Error("❌ This username is already taken");

    const db = await getDB();
    const query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
    const result = await db.run(query, [email, username, password]);

    // We return the id that was used to store in DB and also the users infos.
    return ({id: result.lastID, email, username, created_at: new Date().toISOString()});
}

export async function findUserByEmail(email) {
    const db = await getDB();
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await db.get(query, [email]);

    return (result);
}
