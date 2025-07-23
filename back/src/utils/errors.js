//Creer une classe derivee de Error pour pouvoir la throw directement avec les bon codes. (Comme en C++)
export class ConflictError extends Error {
    constructor(message) {
        super(message); // Appelle le constructeur parent avec le parametre.
        this.statusCode = 409;
        this.name = "ConclictError";
    }
}
