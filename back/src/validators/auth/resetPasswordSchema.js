const bodyJsonSchema = {
    required: ["token", "password"],
    properties: {
        token: { type: "string", minLength: 1 },
        password: { type: "string", minLength: 8, maxLength: 128}
    }
};

const resetPasswordSchema = {
    schema: {
        body: bodyJsonSchema
    }
}

export default resetPasswordSchema;
