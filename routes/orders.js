const express = require("express");
const router = express();
const Order = require("../models/order");
const Product = require("../models/product");
const { userAuth, adminAuth } = require("../middleware/auth");

router.get("/", userAuth, async(req, res) => {
    try {
        const order = await Order.find()
            .populate("product", ["name", "price"])
            .populate("user", ["name"])
            .sort({ date: -1 });
        if (!order)
            return res.status(400).json({ msg: "no order placed yet", order });
        return res.status(200).json({
            total_orders: order.length,
            msg: "Get All order fetched!!",
            order,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

router.post("/", userAuth, async(req, res) => {
    try {
        // const product = await Product.findById(req.body.productId);
        // if (!product) return res.status(404).json({ msg: "Product Not Found" });
        const order = new Order({
            products: req.body.products,
            user: req.user.id,
        });

        await order.save();
        res.status(200).json({ msg: "Order Added ", PlacedOrder: order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server Error");
    }
});

router.get("/:orderId", userAuth, async(req, res) => {
    try {
        const id = req.params.orderId;
        console.log(id);
        const order = await Order.findById(id)
            .populate("product", ["name", "price"])
            .sort({ date: -1 });
        if (!order) {
            return res
                .status(401)
                .json({ msg: " No Order with this Id", orderId: req.params.orderId });
        } else {
            res.status(200).json({ msg: " Order details", order });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

router.delete("/:orderId", userAuth, async(req, res) => {
    try {
        const id = req.params.orderId;
        console.log(id);

        const order = await Order.findByIdAndDelete(id);
        if (!order)
            return res
                .status(404)
                .json({ msg: "No user with this id", Your_id: req.params.orderId });
        return res.status(200).json({ msg: "order Deleted Succesfully", order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

// router.patch("/:productId", (req, res) => {
//   res.status(200).json({ msg: " Update a product by id" });
// });

module.exports = router;