const { z } = require("zod");

const baseProductSchema = {
    sku: z.string().min(1, "SKU is required").max(50, "SKU must be at most 50 characters").trim(),
    
    name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters").max(200, "Name must be at most 200 characters").trim(),
    
    description: z.string().max(1000, "Description must be at most 1000 characters").nullable().optional(),
    
    category: z.string().min(1, "Category is required").min(2, "Category must be at least 2 characters")
    .max(100, "Category must be at most 100 characters").trim(),
    
    type: z.enum(["public", "private"], {errorMap: () => ({message: "Type must be either 'public' or 'private'"})}),
    
    price: z.number().positive("Price must be greater than 0").multipleOf(0.01, "Price must have at most 2 decimal places"),
    
    discountPrice: z.number().positive("Discount price must be greater than 0").multipleOf(0.01, "Discount price must have at most 2 decimal places")
    .nullable().optional(),
    
    quantity: z.number().int("Quantity must be an integer").nonnegative("Quantity must be at least 0")

};


const createProductSchema = z
    .object({
        sku: baseProductSchema.sku,
        name: baseProductSchema.name,
        description: baseProductSchema.description,
        category: baseProductSchema.category,
        type: baseProductSchema.type,
        price: baseProductSchema.price,
        discountPrice: baseProductSchema.discountPrice,
        quantity: baseProductSchema.quantity
    })
    .strict()
    .refine(
        (data) => !data.discountPrice || data.discountPrice < data.price,
        {
            message: "Discount price must be less than original price",
            path: ["discountPrice"]
        }
    );

    const updateProductSchema = z.object({
        sku: baseProductSchema.sku.optional(),
        name: baseProductSchema.name.optional(),
        description: baseProductSchema.description.optional(),
        category: baseProductSchema.category.optional(),
        type: baseProductSchema.type.optional(),
        price: baseProductSchema.price.optional(),
        discountPrice: baseProductSchema.discountPrice.optional(),
        quantity: baseProductSchema.quantity.optional()
    }).strict().refine(
        (data) => !data.discountPrice || !data.price || data.discountPrice < data.price,
        {
            message: "Discount price must be less than original price",
            path: ["discountPrice"]
        }
    ).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided for update"
        }
    );

    const getAllProductsQuerySchema = z
    .object({
        page: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return undefined;
                const num = parseInt(val);
                if (isNaN(num) || num < 1) return 1;
                return num;
            }),
        
        limit: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return undefined;
                const num = parseInt(val);
                if (isNaN(num) || num < 1) return 10;
                if (num > 100) return 100;
                return num;
            }),
        
        category: z
            .string()
            .max(100, "Category filter must be at most 100 characters")
            .optional(),
        
        type: z
            .enum(["public", "private"])
            .optional(),
        
        search: z
            .string()
            .max(200, "Search query must be at most 200 characters")
            .optional(),
        
        sort: z
            .enum(["name", "price", "quantity", "createdAt"], {
                errorMap: () => ({ message: "Sort must be one of: name, price, quantity, createdAt" })
            })
            .optional(),
        
        order: z
            .enum(["asc", "desc"], {
                errorMap: () => ({ message: "Order must be either 'asc' or 'desc'" })
            })
            .optional(),
        
        minPrice: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return undefined;
                const num = parseFloat(val);
                if (isNaN(num)) return undefined;
                return num;
            }),
        
        maxPrice: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return undefined;
                const num = parseFloat(val);
                if (isNaN(num)) return undefined;
                return num;
            })
    })
    .refine(
        (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
        {
            message: "minPrice must be less than or equal to maxPrice",
            path: ["minPrice"]
        }
    );


const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid product ID"),
  }),
});

const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid product ID"),
  }),
});

    module.exports = {
        createProductSchema,
        updateProductSchema,
        getAllProductsQuerySchema,
        getProductByIdSchema,
        deleteProductSchema
    }

