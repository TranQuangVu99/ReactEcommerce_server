const router = require("express").Router();

const Order = require("../models/order");
const verifyToken = require("../middlewares/verify-token");

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let orders = await Order.find({ user: req.decoded._id })
      .deepPopulate("products.productID")
      .exec();

    res.json({
      success: true,
      orders: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;