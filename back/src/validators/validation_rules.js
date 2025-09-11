import { basicInputChecks } from "./basic_checks.js";
import { ValidationError } from "../utils/errors.js";

export function verifyEmailInput(email) {
    basicInputChecks(email, "string", "email", "body");

    // Remove les espaces autour du mail.
    const trimmedEmail = email.trim();

    // Verifie la longueur.
    if (trimmedEmail.length === 0 || trimmedEmail.length > 255)
        throw new ValidationError("Invalid email format (length invalid)");

    // Verifie certains caracteres dangereux.
    if (/[<>"'\\]/.test(trimmedEmail))
        throw new ValidationError("Invalid email format (contains forbidden characters)");

    // Verifie le format email.
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail))
        throw new ValidationError("Invalid email format");

    return trimmedEmail.toLowerCase();
}

export function verifyPasswordInput(password) {
    basicInputChecks(password, "string", "password", "body");

    if (!password || password.length < 8 || password.length > 128)
        throw new ValidationError("Password does not meet length requirements (Between 8 and 128 characters)");

    if (!/\d/.test(password))
        throw new ValidationError("Password must contain at least one number");

    if (!/[a-z]/.test(password))
        throw new ValidationError("Password must contain at least one lowercase letter");

    if (!/[A-Z]/.test(password))
        throw new ValidationError("Password must contain at least one uppercase letter");

    if (!/[!@#$%^&*]/.test(password))
        throw new ValidationError("Password must contain at least one special character (!@#$%^&*)");

    return (password);
}

export function verifyUsernameInput(username) {
    basicInputChecks(username, "string", "username", "body");

    const trimmedUsername = username.trim();

    if (!username || trimmedUsername.length < 3 || trimmedUsername.length > 30)
        throw new ValidationError("Username does not meet length requirements (between 3 and 30 characters)");

    if (!/^[a-zA-Z0-9-]+$/.test(trimmedUsername))
        throw new ValidationError("Username can only contain letters, numbers or dash");

    return trimmedUsername;
}
