const Order = require("../../models/Order.model");
const User = require("../../models/User.model");
const Product = require("../../models/Product.model").default;

const placeOrder = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { items, address, phone } = req.body;

    const user = await User.findById(userId);

    const finalAddress = address || user.address;
    const finalPhone = phone || user.phone;

    if (!finalAddress || !finalPhone) {
      return res.status(400).json({
        message: "Address and phone are required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || product.isDeleted || product.status !== "Active") {
        return res.status(404).json({ message: "Product not available" });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const confirmFinalAmount =  product.finalPrice | product.price;

      totalAmount += confirmFinalAmount * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: confirmFinalAmount,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address: finalAddress,
      phone: finalPhone,
      paymentStatus: "Pending",
      status: "Created",
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      totalAmount,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Order placement failed",
      err: err.message,
    });
  }
};

module.exports = { placeOrder };
