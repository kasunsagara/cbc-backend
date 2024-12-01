import Order from "../models/order.js";
import { isCustomer } from "./userController.js";

export async function createOrder(req, res) {

    if(!isCustomer(req)) {
        res.json({
            message: "Please login as customer to create orders"
        });
        return;
    }

    try {
        const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

        let orderId;

        if(latestOrder.length == 0) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0].orderId;

            const numberString = currentOrderId.replace("CBC", "");

            const number = parseInt(numberString)

            const newNumber = (number + 1).toString().padStart(4, "0");

            orderId = "CBC" + newNumber;
        }

        const newOrderData = req.body;
        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        const order = new Order(newOrderData);

        await order.save();

        res.json({
            message: "Order created"
        });
    } catch (error) {
        res.json({
            message: error.message
        });
    }
}