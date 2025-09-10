const bodyJsonSchema = {
    type: "object",
    required: ["email"],
    properties: {
        email: {
            type: "string",
            format: "email",
            maxLength: 255
        }
    }
};

const forgotPasswordSchema = {
    schema: {
        body: bodyJsonSchema
    }
}

export default forgotPasswordSchema;
