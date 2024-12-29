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
