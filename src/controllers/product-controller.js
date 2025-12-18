const {
    createProduct: createProductService,
    getAllProducts: getAllProductsService,
    getProduct: getProductService,
    updateProduct: updateProductService,
    deleteProduct: deleteProductService,
    getProductStats: getProductStatsService
} = require("../services/product-service");


exports.createProduct = async (req, res, next) => {
    try {
        const product = await createProductService(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};


exports.getAllProducts = async (req, res, next) => {
    try {
        const { products, pagination } = await getAllProductsService(req.query, req.user.role);

        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products,
            pagination
        });
    } catch (error) {
        next(error);
    }
};


exports.getProduct = async (req, res, next) => {
    try {
        const product = await getProductService(req.params.id, req.user.role);

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};


exports.updateProduct = async (req, res, next) => {
    try {
        const product = await updateProductService(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const deletedInfo = await deleteProductService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedInfo
        });
    } catch (error) {
        next(error);
    }
};


exports.getProductStats = async (req, res, next) => {
    try {
        const stats = await getProductStatsService();

        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
