const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product Management API",
            version: "1.0.0",
            description: "A comprehensive REST API for managing products with role-based access control, validation, and complete CRUD operations."
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server"
            }
        ],
        components: {
            securitySchemes: {
                userRole: {
                    type: "apiKey",
                    in: "header",
                    name: "X-User-Role",
                    description: "User role header - must be either 'user' or 'admin'"
                }
            },
            schemas: {
                Product: {
                    type: "object",
                    required: ["sku", "name", "category", "type", "price", "quantity"],
                    properties: {
                        _id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011"
                        },
                        sku: {
                            type: "string",
                            maxLength: 50,
                            example: "LAPTOP-001"
                        },
                        name: {
                            type: "string",
                            minLength: 3,
                            maxLength: 200,
                            example: "Gaming Laptop"
                        },
                        description: {
                            type: "string",
                            maxLength: 1000,
                            nullable: true,
                            example: "High-performance gaming laptop"
                        },
                        category: {
                            type: "string",
                            minLength: 2,
                            maxLength: 100,
                            example: "Electronics"
                        },
                        type: {
                            type: "string",
                            enum: ["public", "private"],
                            example: "public"
                        },
                        price: {
                            type: "number",
                            format: "float",
                            minimum: 0.01,
                            example: 1299.99
                        },
                        discountPrice: {
                            type: "number",
                            format: "float",
                            nullable: true,
                            example: 1099.99
                        },
                        quantity: {
                            type: "integer",
                            minimum: 0,
                            example: 50
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-15T10:30:00Z"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-15T10:30:00Z"
                        }
                    }
                },
                ValidationError: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string",
                            example: "Validation error"
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: {
                                        type: "string",
                                        example: "price"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Price must be greater than 0"
                                    },
                                    code: {
                                        type: "string",
                                        example: "too_small"
                                    }
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string",
                            example: "Error message"
                        }
                    }
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        message: {
                            type: "string"
                        },
                        data: {
                            oneOf: [
                                { $ref: "#/components/schemas/Product" },
                                { type: "array", items: { $ref: "#/components/schemas/Product" } }
                            ]
                        }
                    }
                },
                Pagination: {
                    type: "object",
                    properties: {
                        currentPage: {
                            type: "integer",
                            example: 1
                        },
                        totalPages: {
                            type: "integer",
                            example: 5
                        },
                        totalItems: {
                            type: "integer",
                            example: 48
                        },
                        itemsPerPage: {
                            type: "integer",
                            example: 10
                        },
                        hasNextPage: {
                            type: "boolean",
                            example: true
                        },
                        hasPreviousPage: {
                            type: "boolean",
                            example: false
                        }
                    }
                },
                Statistics: {
                    type: "object",
                    properties: {
                        totalProducts: {
                            type: "integer",
                            example: 150
                        },
                        totalInventoryValue: {
                            type: "number",
                            format: "float",
                            example: 125000.50
                        },
                        totalDiscountedValue: {
                            type: "number",
                            format: "float",
                            example: 98000.00
                        },
                        averagePrice: {
                            type: "number",
                            format: "float",
                            example: 833.34
                        },
                        outOfStockCount: {
                            type: "integer",
                            example: 12
                        },
                        productsByCategory: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    category: { type: "string" },
                                    count: { type: "integer" },
                                    totalValue: { type: "number", format: "float" }
                                }
                            }
                        },
                        productsByType: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string" },
                                    count: { type: "integer" },
                                    totalValue: { type: "number", format: "float" }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                userRole: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
