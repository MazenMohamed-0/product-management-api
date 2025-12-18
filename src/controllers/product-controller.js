const productService = require("../services/product-service");

const createProduct = async (req, res) => {
    try {
        const product = await createProduct(req.body);

        res.status(201).json({
            success:true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const { products, pagination } = await getAllProducts(req.query, req.user.role);

        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products,
            pagination
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// 3. Get Single Product
exports.getProduct = async (req, res) => {
    try {
        const product = await getProduct(req.params.id, req.user.role);

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// 4. Update Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await updateProduct(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// 5. Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedInfo = await deleteProduct(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedInfo
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// 6. Get Product Statistics
exports.getProductStats = async (req, res) => {
    try {
        const stats = await getProductStats();

        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: stats
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};
