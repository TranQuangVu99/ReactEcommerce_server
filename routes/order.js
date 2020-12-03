const router = require("express").Router();

const Order = require("../models/order");
const verifyToken = require("../middlewares/verify-token");

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let orders = await Order.find({ user: req.decoded._id })
      .deepPopulate(
        "products.productID.colors.image products.productID.colors.color products.productID.capacities"
      )
      .exec();

    let orderDTO = []
    orders.map((order) => {
      let orderdetails = [];
      order.products.map((product) => {
        const data = {
          name: product.productID.name,
          image: product.productID.colors[0].image.photo,
          quantity: product.quantity,
          price: product.price,
        };
        orderdetails.push(data);
      });
      orderDTO.push({
        estimatedDelivery:order.estimatedDelivery,
        orderDetail:orderdetails
      })
    });

    res.json({
      success: true,
      orders: orderDTO,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
