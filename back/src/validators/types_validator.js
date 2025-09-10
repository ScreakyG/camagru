import { ValidationError } from "../utils/errors.js";

export function typesValidator(input, type, exepected) {
    if (typeof input !== type)
        throw new ValidationError(`Invalid ${exepected} format (not a ${type})`);
}
