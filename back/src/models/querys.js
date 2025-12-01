import { getDB } from "../services/db.js";
import { ConflictError } from "../utils/errors.js";
import { encryptPassword, hashToken } from "../utils/encrypt.js";
import { createValidationToken } from "../utils/jwt.js";
import { setExpirationDate } from "../utils/time.js";

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
    const hashedToken = hashToken(verificationToken);

    const db = await getDB();
    const query = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    const result = await db.run(query, [username, email, hashPass]);
    await insertTokenDatabase(result.lastID, hashedToken, setExpirationDate(60), "validation");

    // We return the id that was used to store in DB and also the users infos.
    return ({id: result.lastID, email, username, verificationToken});
}

export async function insertTokenDatabase(userId, tokenHash, tokenExp, purpose)
{
    const db = await getDB();

    // Delete l'ancien token pour l'invalider.
    const query = `DELETE FROM tokens WHERE user_id = ? AND purpose = ?`;
    await db.run(query, [userId, purpose]);

    // Insertion du nouveau token.
    const query2 = `INSERT INTO tokens (token_hash, token_expiration, purpose, user_id) VALUES (?, ?, ?, ?)`;
    await db.run(query2, [tokenHash, tokenExp, purpose, userId]);
}

export async function findUserById(id) {
    const db = await getDB();
    const query = "SELECT * FROM users WHERE id = ?";
    const result = await db.get(query, [id]);

    return (result);
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

export async function findUserByAuthToken(tokenHash) {
    const db = await getDB();

    const query = `SELECT users.* FROM tokens JOIN users ON tokens.user_id = users.id WHERE tokens.token_hash = ? AND purpose = ?`;
    const result = await db.get(query, [tokenHash, "auth"]);

    return (result);
}

export async function findUserByValidationToken(tokenHash) {
    const db = await getDB();
    const query = "SELECT users.* FROM tokens JOIN users ON tokens.user_id = users.id WHERE tokens.token_hash = ? AND purpose = ? AND tokens.token_expiration > strftime('%s', 'now')";
    const result = await db.get(query, [tokenHash, "validation"]);

    return (result);
}

export async function findUserByResetPasswordToken(token) {
    const db = await getDB();
    const query = "SELECT users.* FROM tokens JOIN users ON tokens.user_id = users.id WHERE tokens.token_hash = ? AND purpose = ? AND tokens.token_expiration > strftime('%s', 'now')";
    const result = db.get(query, [token, "reset_password"]);

    return (result);
}

export async function setVerifiedUser(user) {
    const db = await getDB();

    const query2 = "DELETE FROM tokens WHERE user_id = ? AND purpose = ?";
    await db.run(query2, [user.id, "validation"]);

    const query = "UPDATE users SET is_verified = 1 WHERE id = ?";
    await db.run(query, [user.id]);
}

export async function updatePassword(user, password) {
    const hashPass = await encryptPassword(password);

    const db = await getDB();
    const query = "UPDATE users SET password_hash = ? WHERE id = ?";
    const result = await db.run(query, [hashPass, user.id]);
}

export async function deleteTokenFromDatabase(tokenHash)
{
    const db = await getDB();
    const query = "DELETE FROM tokens WHERE token_hash = ?";
    const result = db.run(query, [tokenHash]);
}

export async function updateEmail(user, newEmail) {
    const db = await getDB();

    const query = "UPDATE users SET email=? WHERE id=?";
    const result = await db.run(query, [newEmail, user.id]);
}

export async function updateUsername(user, newUsername) {
    const db = await getDB();

    const query = "UPDATE users SET username=? WHERE id=?";
    const result = await db.run(query, [newUsername, user.id]);
}

export async function updateNotificationsState(newState, user) {
   const db = await getDB();

   const query = `UPDATE users SET notifications = ? WHERE id = ?`;
   const result = await db.run(query, [newState, user.id]);

   return (result);
}

export async function linkImageToUser(path, user) {
    const db = await getDB();

    const query = `INSERT INTO images (img_path, user_id) VALUES (?, ?)`
    const result = await db.run(query, [path, user.id]);

    return (result.lastID);
}

export async function getAllUserImages(user) {
    const db = await getDB();

    // const query = `SELECT images.* FROM users JOIN images ON users.id = images.user_id WHERE users.id = ?`;
    const query = `SELECT * FROM images WHERE images.user_id = ? ORDER BY created_at DESC`;
    const result = await db.all(query, [user.id]);

    return (result);
}

export async function getAllPosts() {
    const db = await getDB();

    const query = `SELECT images.id, images.img_path, images.user_id, images.created_at, users.username FROM images JOIN users ON users.id = images.user_id ORDER BY images.created_at DESC`;
    const result = await db.all(query);

    return (result);
}

export async function getLimitedPosts(limit, offset) {
    const db = await getDB();

    const query = `SELECT
    images.id,
    images.img_path,
    images.user_id,
    images.created_at,
    users.username
    FROM images JOIN users ON users.id = images.user_id
    ORDER BY images.created_at DESC
    LIMIT ? OFFSET ?`;

    const result = await db.all(query, [limit, offset]);

    return (result);
}

export async function getImageById(imageId) {
    const db = await getDB();

    const query = `SELECT * FROM images WHERE id = ?`;
    const result = await db.get(query, [imageId]);

    return (result);
}

export async function deleteImageById(imageId) {
    const db = await getDB();

    const query = `DELETE FROM images WHERE id = ?`
    const result = await db.run(query, [imageId]);
}

export async function insertLikeImage(userId, imageId) {
    const db = await getDB();

    const query = `INSERT INTO likes (user_id, image_id) VALUES (?, ?)`;
    const result = await db.run(query, [userId, imageId]);

    return (result);
}

export async function removeLikeImage(userId, imageId) {
    const db = await getDB();

    const query = `DELETE FROM likes WHERE user_id = ? AND image_id = ?`;
    const result = await db.run(query, [userId, imageId]);

    return (result);
}

export async function getImageLikes(imageId) {
    const db = await getDB();

    const query = `SELECT user_id FROM likes WHERE image_id = ?`;
    const result = await db.all(query, [imageId]);

    return (result);
}

export async function insertCommentPost(userInfo, comment, imageId) {
    const db = await getDB();

    const query = `INSERT INTO comments (user_id, image_id, content) VALUES (?, ?, ?)`;
    const result = await db.run(query, [userInfo.id, imageId, comment]);

    return (result);
}

export async function getAllImageComments(imageId) {
    const db = await getDB();

    const query = `SELECT comments.id, comments.image_id, comments.content, comments.created_at, users.username FROM comments JOIN users ON users.id = comments.user_id WHERE comments.image_id = ? ORDER BY comments.created_at DESC`;
    const result = await db.all(query, [imageId]);

    return (result);
}
