//Creer une classe derivee de Error pour pouvoir la throw directement avec les bon codes. (Comme en C++)
export class ConflictError extends Error {
    constructor(message) {
        super(message); // Appelle le constructeur parent avec le parametre.
        this.statusCode = 409;
        this.name = "ConclictError";
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message); // Appelle le constructeur parent avec le parametre.
        this.statusCode = 400;
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = "AuthenticationError";
    }
}

export class AccountValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
        this.name = "AccountValidationError";
    };
}
