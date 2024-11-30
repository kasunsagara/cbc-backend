import Product from "../models/product.js";

export async function getProduct(req, res) {

    try {
        const productList = await Product.find();

        res.json({
            list: productList
        })
    } catch (e) {
        res.json({
            message: "Error"
        })
    }
}

export async function getProductByName(req, res) {

    const name = req.params.name;

    try {
        const productList = await Product.find({name: name});
        if (productList.length === 0) {
            res.json({
                message: "Product not found"
            });
        } else {
            res.json({
                list: productList
            });
        }
    } catch (e) {
        res.json({
            message: "Product fetch failed"
        });
    }
}

export async function createProduct(req, res) {

    console.log(req.user);

    if (req.user == null) {
        res.json({
            message: "You are not logged in"
        });
        return;
    }

    if (req.user.type != "admin") {
        res.json({
            message: "You are not an admin"
        });
        return;
    }

    try {
        const product = new Product(req.body);

        await product.save();

        res.json({
            message: "Product created"
        });
    } catch (e) {
        res.json({
            message: "Product not created"
        });
    }
}


export async function deleteProduct(req, res) {

    try {
        await Product.deleteOne({name: req.params.name});

        res.json({
            message: "Product deleted successfully"
        });
    } catch (e) {
        res.json({
            message: "Product not deleted"
        });
    }
}
