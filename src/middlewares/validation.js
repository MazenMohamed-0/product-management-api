const { ZodError } = require("zod");


const formatZodError = (error) => {
    return {
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => ({
            field: err.path.join(".") || "body",
            message: err.message,
            code: err.code
        }))
    };
};


const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json(formatZodError(error));
            }

            res.status(500).json({
                success: false,
                message: "Validation processing error"
            });
        }
    };
};


const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.query);
            req.query = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json(formatZodError(error));
            }

            res.status(500).json({
                success: false,
                message: "Validation processing error"
            });
        }
    };
};


const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.params);
            req.params = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json(formatZodError(error));
            }

            res.status(500).json({
                success: false,
                message: "Validation processing error"
            });
        }
    };
};

module.exports = {
    validateBody,
    validateQuery,
    validateParams
};
