const { Promise } = require("mongoose");
const Product = require("../models/product-model");
const ServiceError = require("../utils/service-error");
const products = require("../models/product-model");

const createProduct = async (data) => {
    try {
        return await Product.create(data);
    } catch (err) {
        if (err.code === 11000) {
            throw new ServiceError("SKU is Already exists", "Error code 409");
        }
        throw err;
    }
};

    const getAllProducts = async ({
        page = 1,
        limit = 10,
        filter = {},
        role = "user",
    }) => {
        const query = { ...filters};

        if (role === "user") {
            quary.type = "public";
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Product.find(query).skip(skip).limit(limit),
            Product.countDocuments(query),
        ]);

        return {
            items,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    };


const productById = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new ServiceError("Product not found", "Error 404");
    }

    if (role === "user" && product.type === " private") {
        throw new ServiceError("Product not found", "Error code 404")
    }

    return product;
};

const updateProduct = async (id, updates) => {
    if ("sku" in updates) {
        throw new ServiceError("SKU cannot be updated", "Error 403");
    }

    const product = await Product.findById(id) ;
    if (!products) {
        throw new ServiceError("Product not found", "Error 404");
    }

    Object.assign(product, updates);
    await product.save();

    return products;
};


const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);

    if(!product) {
        throw new ServiceError("Product not found", "Error 404");
    }

    return {
        id: product.id,
        sku: product.sku,
    };
};

module.exports = {
    createProduct,
    getAllProducts,
    productById,
    updateProduct,
    deleteProduct
};