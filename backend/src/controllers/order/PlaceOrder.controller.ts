import { Request, Response } from "express";
const Order = require("../../models/Order.model");
const User = require("../../models/User.model");
const Product = require("../../models/Product.model");

const placeOrder = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.id;
    const { items, address, phone } = req.body;

    /* =====================
       USER CHECK
    ===================== */
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* =====================
       SAVE ADDRESS & PHONE
    ===================== */
    if (address) user.address = address;
    if (phone) user.phone = phone;

    await user.save();

    if (!user.address || !user.phone) {
      return res.status(400).json({
        message: "Address and phone are required",
      });
    }

    /* =====================
       ORDER ITEMS
    ===================== */
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      // Check if product exists and is active
      if (!product || product.isDeleted || product.status !== "Active") {
        return res.status(404).json({
          message: `${item.product} is not available`,
        });
      }

      // ✅ Check stock
      if (product.stock <= 0) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // ✅ Prevent buying more than available stock
      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} are available`,
        });
      }

      const finalPrice = product.finalPrice ?? product.price;
      totalAmount += finalPrice * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: finalPrice,
      });
    }

    /* =====================
       CREATE ORDER (NO PAYMENT)
    ===================== */
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address: user.address,
      phone: user.phone,
      status: "Pending",
    });

    /* =====================
       CLEAR USER CART
    ===================== */
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
      totalAmount,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Order placement failed",
      error: err.message,
    });
  }
};

module.exports = { placeOrder };
