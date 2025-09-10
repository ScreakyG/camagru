const bodyJsonSchema = {
    type: 'object',
    required: ["username", "email", "password"],
    properties: {
        username: {
            type: "string",
            minLength: 3,
            maxLength: 30
        },
        email: {
            type: "string",
            format: 'email',
            maxLength: 255
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 128
        }
    },
    additionalProperties: false
};

const registerSchema = {
    schema: {
        body: bodyJsonSchema
    }
};

export default registerSchema;
