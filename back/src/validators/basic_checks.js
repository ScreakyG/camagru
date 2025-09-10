import { BadRequestError } from "../utils/errors.js";
import { typesValidator } from "./types_validator.js";

export function basicInputChecks(input, type, expected, where) {
    if (!input)
        throw new BadRequestError(`Missing ${expected} in ${where}.`);
    typesValidator(input, type, expected);
}
