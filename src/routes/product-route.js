const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStats
} = require("../controllers/product-controller");
const { adminOnly } = require("../middlewares/auth");
const { createProduct } = require("../services/product-service");

const router = express.Router()

express.post("/", adminOnly, createProduct);

express.get("/stats", adminOnly, getProductStats);

express.get("/", getAllProducts);

express.get(":id",getProduct);

express.put(":id", adminOnly, updateProduct);

express.delete(":id", adminOnly,deleteProduct);

module.exports = router;

