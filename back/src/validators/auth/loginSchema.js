const bodyJsonSchema = {
    type: 'object',
    required: ["username", "password"],
    properties: {
        username: {
            type: "string",
            maxLength: 30
        },
        password: {
            type: "string",
            maxLength: 128
        }
    },
    additionalProperties: false
};

const loginSchema = {
    schema: {
        body: bodyJsonSchema
    }
};

export default loginSchema;
