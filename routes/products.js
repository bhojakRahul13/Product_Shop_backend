const express = require("express");
const router = express();
const Product = require("../models/product");
const { userAuth, adminAuth } = require("../middleware/auth");
const { upload } = require("../middleware/multer");
const {
    addProduct,
    getAllProducts,
    getProductsId,
    updateProductById,
    deleteProductById,
} = require("../controller/productController");

router.get("/", getAllProducts);

router.post("/", adminAuth, upload.single("productImage"), addProduct);

router.get("/:productId", adminAuth, getProductsId);

router.put(
    "/:productId",
    adminAuth,
    upload.single("productImage"),
    updateProductById
);

router.delete("/:productId", adminAuth, deleteProductById);

module.exports = router;