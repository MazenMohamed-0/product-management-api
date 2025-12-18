require("dotenv").config();
const connectDB = require("../src/config/db");
const productService = require("./services/product-service")

const testService = async () => {
    await connectDB();

    console.log("Create Product");
    const product = await productService.createProduct({
        sku: "SERVICE-001",
        name: "Service Test Product",
        category: "Testing",
        type: "public",
        price: 199.99,
        quantity: 20,
    });

    console.log(product);

    console.log("Updating product");
    const updated = await productService.updateProduct(product.id, {
        price: 149.99,
        quantity: 15,
    });
    console.log(updated.price, updated.quantity);

    console.log("Testing SKU immutability");
    try {
        await productService.updateProduct(product.id, {
            sku: "New-SKU"
        });
    }catch (e) {
        console.log(e.code);
    }

    console.log("deleteing Product");
    const deleted = await productService.deleteProduct(product.id);
    console.log(deleted)

};


testService().catch((err) => {
    console.log("Service didn't start because " + err.message)
});