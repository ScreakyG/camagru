const registerSchema = {
    body: {
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
    }
};

const loginSchema = {
    body: {
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
    }
};

const forgotPasswordSchema = {
    body: {
        type: "object",
        required: ["email"],
        properties: {
            email: {
                type: "string",
                format: "email",
                maxLength: 255
            }
        }
    }
};

const resetPasswordSchema = {
    body: {
        required: ["token", "password"],
        properties: {
            token: { type: "string", minLength: 1 },
            password: { type: "string", minLength: 8, maxLength: 128}
        }
    }
}

const resendValidationSchema = {
    body: {
        type: "object",
        required: ["email"],
        properties: {
            email: {
                type: "string",
                format: "email",
                maxLength: 255
            }
        }
    }
};

export default {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    resendValidationSchema
};
