const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal server error";
    let errors = null;

    
    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation error";
        errors = err.errors.map((error) => ({
            field: error.path.join(".") || "unknown",
            message: error.message,
            code: error.code
        }));
    }
    
    else if (err.status && err.message) {
        statusCode = err.status;
        message = err.message;
    }
    
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation error";
        errors = Object.keys(err.errors).map((field) => ({
            field,
            message: err.errors[field].message
        }));
    }
    
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    
    else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists`;
    }
    
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    
    else if (err.message) {
        message = err.message;
    }

    
    const errorResponse = {
        success: false,
        message
    };

    if (errors) {
        errorResponse.errors = errors;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
