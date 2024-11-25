import express from "express";
import { getProduct, getProductByName, createProduct, deleteProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProduct);

productRouter.get("/:name", getProductByName);

productRouter.post("/", createProduct);

productRouter.delete("/:name", deleteProduct);

export default productRouter;