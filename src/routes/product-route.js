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

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product. Admin only endpoint.
 *     tags:
 *       - Products
 *     security:
 *       - userRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sku, name, category, type, price, quantity]
 *             properties:
 *               sku:
 *                 type: string
 *                 maxLength: 50
 *                 example: "LAPTOP-001"
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: "Gaming Laptop"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 nullable: true
 *                 example: "High-performance gaming laptop"
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Electronics"
 *               type:
 *                 type: string
 *                 enum: [public, private]
 *                 example: "public"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 1299.99
 *               discountPrice:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 example: 1099.99
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - missing or invalid X-User-Role header
 *       403:
 *         description: Forbidden - admin access required
 *       409:
 *         description: Conflict - SKU already exists
 */
router.post("/", adminOnly, validateBody(createProductSchema), createProduct);

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get product statistics
 *     description: Returns comprehensive statistics about products including inventory value, categories, and types. Admin only endpoint.
 *     tags:
 *       - Statistics
 *     security:
 *       - userRole: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Statistics retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Statistics'
 *       401:
 *         description: Unauthorized - missing or invalid X-User-Role header
 *       403:
 *         description: Forbidden - admin access required
 */
router.get("/stats", adminOnly, getProductStats);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     description: Returns a paginated list of products. Users see only public products, admins see all products.
 *     tags:
 *       - Products
 *     security:
 *       - userRole: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [public, private]
 *         description: Filter by product type
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search in product name and description (case-insensitive)
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [name, price, quantity, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - name: order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - name: minPrice
 *         in: query
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price filter
 *       - name: maxPrice
 *         in: query
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Products retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - missing or invalid X-User-Role header
 */
router.get("/", validateQuery(getAllProductsQuerySchema), getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Returns a specific product. Users can only view public products, admins can view all products.
 *     tags:
 *       - Products
 *     security:
 *       - userRole: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID format
 *       401:
 *         description: Unauthorized - missing or invalid X-User-Role header
 *       404:
 *         description: Product not found
 */
router.get("/:id", validateParams(getProductByIdSchema), getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product. Supports partial updates. SKU is immutable. Admin only endpoint.
 *     tags:
 *       - Products
 *     security:
 *       - userRole: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 nullable: true
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               type:
 *                 type: string
 *                 enum: [public, private]
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *               discountPrice:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or invalid ID format
 *       401:
 *         description: Unauthorized - missing or invalid X-User-Role header
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Product not found
 */
router.put("/:id", adminOnly, validateParams(getProductByIdSchema), validateBody(updateProductSchema), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID. Admin only endpoint.
 *     tags:
 *       - Products
 *     security:
 *       - userRole: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     sku:
 *                       type: string
 *       400:
 *         description: Invalid product ID format
 *       401:
 *         description: Unauthorized - missing or invalid X-User-Role header
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Product not found
 */
router.delete("/:id", adminOnly, validateParams(deleteProductSchema), deleteProduct);

module.exports = router;

