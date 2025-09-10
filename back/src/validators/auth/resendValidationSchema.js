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

const resendValidationSchema = {
    schema: {
        body: bodyJsonSchema
    }
};

export default resendValidationSchema;
