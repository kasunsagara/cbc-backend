import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {

    if(!isAdmin(req)) {
        res.json({
            message: "Please login as administrator to add products"
        });
        return;
    }

    const newProductData = req.body;

    try {
        const product = new Product(newProductData);
        await product.save();
        res.json({
            message: "Product created"
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}

export async function getProducts(req, res) {

    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.json({
            message: error
        });
    }
}

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Please login as administrator to delete products",
        });
        return;
    }

    const productId = req.params.productId;

    try {
        await Product.deleteOne({ productId: productId });
        res.json({
            message: "Product deleted",
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}

export function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Please login as administrator to update products"
        });
        return;
    }

    const productId = req.params.productId;
    const newProductData = req.body;

    Product.updateOne({productId: productId}, newProductData)
        .then(() => {
            res.json({
                message: "Product updated"
            });
        })
        .catch((error) => {
            res.status(403).json({
                message: error
            });
        });
}

