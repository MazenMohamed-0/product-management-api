const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const productRoute = require("./routes/product-route");
const errorHandler = require("./middlewares/errorHandler");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: 1
    },
    customCss: ".swagger-ui .topbar { display: none }"
}));


app.use("/api/products", productRoute);


app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorHandler);

module.exports = app;
