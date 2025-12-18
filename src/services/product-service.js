const { Promise } = require("mongoose");
const Product = require("../models/product-model");

const createProduct = async (data) => {
    const { sku, name, description, category, type, price, discountPrice, quantity } = data;

    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
        throw { status: 409, message: "SKU already exists" };
    }

    const newProduct = new Product({
        sku,
        name,
        description: description || null,
        category,
        type,
        price,
        discountPrice: discountPrice || null,
        quantity
    });

    await newProduct.save();
    return newProduct;
};

    const getAllProducts = async (query, userRole) => {
        const {
            page = 1,
            limit = 10,
            category,
            type,
            search,
            sort = "createdAt",
            order = "desc",
            minPrice,
            maxPrice
        } = query;

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

        let filter = {};

        if ( userRole !== "admin") {
            filter.type = "public"
        }

        if (category) {
            filter.category = category;
        }

        if (type) {
            filter.type = type;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) {
                filter.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice !== undefined) {
                filter.price.$lte = parseFloat(maxPrice);
            }
        }

        const sortObj = {};
        const validSortFields = ["name", "price", "quantity", "createdAt"];
        const sortField = validSortFields.includes(sort) ? sort : "createdAt";
        const sortOrder = order === "asc" ? 1 : -1;
        sortObj[sortField] = sortOrder;

        const totalItems = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortObj)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalPages = Math.ceil(totalItems / limitNum);

        return {
            products,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1
            }
        };
    };



const getProduct = async (id, userRole) => {
    const product = await Product.findById(id);

    if(!product) {
        throw {status : 404, message :"Product not found"};
    }

    if (userRole !== "admin" && product.type === "private") {
        throw {status: 404, message: "Product not found"};
    }

    return product;
};

const updateProduct = async (id, updateData) => {
    if (updateData.sku) {
        throw {status: 400, message: "SKU cannot be updated"};
    }

    const product= await Product.findById(id);

    if (!product) {
        throw {status: 404, message: "Product not found"};
    }

    const allowedfields = ["name", "description", "category", "type", "price", "discountPrice", "quantity"];
    Object.keys(updateData).forEach(key => {
        if (allowedfields.includes(key)) {
            product[key] = updatedData[key];
        }
    });
    await product.save();
    return product;
};


const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
        throw { status: 404, message: "Product not found"};
    }

    return {
        id: product._id,
        sku: product.sku
    };
};

const getProductStats = async () => {
    const products = await Product.find();

    if (products.length === 0) {
        return {
            totalProducts: 0,
            totalInventoryValue: 0,
            totalDiscountedValue: 0,
            averagePrice: 0,
            outOfStockCount: 0,
            productsByCategory: [],
            productsByType: []
        };
    }

    let totalInventoryValue = 0;
    let totalDiscountedValue = 0;
    let outOfStockCount = 0;

    products.forEach(product => {
        totalInventoryValue += product.price * product.quantity;
        if (product.discountPrice) {
            totalDiscountedValue += product.discountPrice * product.quantity;
        }
        if (product.quantity === 0) {
            outOfStockCount++;
        }
    });

    const totalProducts = products.length;
    const averagePrice = totalInventoryValue / totalProducts;

    const categoryMap = {};
    products.forEach(product => {
        if (!categoryMap[product.category]) {
            categoryMap[product.category] = {
                category: product.category,
                count: 0,
                totalValue: 0
            };
        }
        categoryMap[product.category].count++;
        categoryMap[product.category].totalValue += product.price * product.quantity;
    });

    const productsByCategory = Object.values(categoryMap);

    const typeMap = {};
    products.forEach(product => {
        if (!typeMap[product.type]) {
            typeMap[product.type] = {
                type: product.type,
                count: 0,
                totalValue: 0
            };
        }
        typeMap[product.type].count++;
        typeMap[product.type].totalValue += product.price * product.quantity;
    });

    const productsByType = Object.values(typeMap);

    return {
        totalProducts,
        totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
        totalDiscountedValue: parseFloat(totalDiscountedValue.toFixed(2)),
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        outOfStockCount,
        productsByCategory,
        productsByType
    };
};


module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStats
};