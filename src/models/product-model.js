const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 50,       
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlenght:3,
            maxlength: 200,   
        },

        description: {
            type: String,
            default: null,
            maxlength: 1000,   
        },

        category: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlenght:2,
            maxlength: 100,   
        },

        type: {
            type: String,
            enum: ["public", "private"],
            default: "public",
            required: true,
        },

        price: {
        type: Number,
        required: true,
        min: 0.01,
        validate: {
            validator: (value) => Number.isInteger(value * 100),
            message: "Price must have at most 2 decimal places",
            },
        },

        discountPrice: {
        type: Number,
        default: null,
        min: 0,
        validate: {
            validator: (value) => {
            if (value === null) return true;
            return Number.isInteger(value * 100);
            },
            message: "Discount price must have at most 2 decimal places",
            },
        },


        quantity: {
            type: Number,
            required: true,
            min:0,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be an integer"
            },
        },   

    },
    {
        timestamps: true,
        versionKey: false,
    }

);

productSchema.pre("save", async function () {
    if (this.discountPrice !== null && this.discountPrice >= this.price) {
        throw new Error("Discount price must be less than original price");
    }
});



const products = mongoose.model("Product", productSchema);
module.exports = products;
