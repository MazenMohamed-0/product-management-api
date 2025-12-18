const express = require("express");
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStats
} = require("../controllers/product-controller");
const { authMiddleware, adminOnly } = require("../middlewares/auth");
const { validateBody, validateQuery, validateParams } = require("../middlewares/validation");
const {
    createProductSchema,
    updateProductSchema,
    getAllProductsQuerySchema,
    deleteProductSchema,
    getProductByIdSchema
} = require("../validations/product-schema");

const router = express.Router();

router.use(authMiddleware);

router.post("/", adminOnly, validateBody(createProductSchema), createProduct);

router.get("/stats", adminOnly, getProductStats);

router.get("/", validateQuery(getAllProductsQuerySchema), getAllProducts);

router.get("/:id", validateParams(getProductByIdSchema), getProduct);

router.put("/:id", adminOnly, validateParams(getProductByIdSchema), validateBody(updateProductSchema), updateProduct);

router.delete("/:id", adminOnly, validateParams(deleteProductSchema), deleteProduct);

module.exports = router;

