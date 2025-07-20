export function verifyEmailInput(email) {

    if (typeof email !== "string")
        throw new Error("Invalid email format (not a string)");

    // Remove les espaces autour du mail.
    const trimmedEmail = email.trim();

    // Verifie la longueur.
    if (trimmedEmail.length === 0 || trimmedEmail.length > 255)
        throw new Error("Invalid email format (length invalid)");

    // Verifie certains caracteres dangereux.
    if (/[<>"'\\]/.test(trimmedEmail))
        throw new Error("Invalid email format (contains forbidden characters)");

    // Verifie le format email.
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail))
        throw new Error('Invalid email format');

    return trimmedEmail.toLowerCase();
}

export function verifyPasswordInput(password) {

    if (typeof password !== "string")
        throw new Error("Invalid password format (not a string)")

    if (!password || password.length < 8)
        throw new Error("Password does not meet requirements (at least 8 characters)");

    if (!/\d/.test(password))
        throw new Error('Password must contain at least one number');

    if (!/[a-z]/.test(password))
        throw new Error('Password must contain at least one lowercase letter');

    if (!/[A-Z]/.test(password))
        throw new Error('Password must contain at least one uppercase letter');

    if (!/[!@#$%^&*]/.test(password))
        throw new Error('Password must contain at least one special character (!@#$%^&*)');

    return (password);
}
