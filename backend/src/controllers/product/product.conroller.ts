import { Request, Response } from "express";
import Product from "../../models/Product.model";
const uploadBufferToCloudinary = require("../../utils/uploadToCloudinary")
const User = require("../../models/User.model")
const mongoose = require("mongoose")

/* =====================
   CREATE PRODUCT
===================== */
export const createProduct = async (req: any, res: any) => {
  try {
    let imageUrls: string[] = [];

    if (req.files?.length) {
      imageUrls = await Promise.all(
        req.files.map((file: any) =>
          uploadBufferToCloudinary (file.buffer, "products")
        )
      );
    }

    const product = await Product.create({
      ...req.body,
      images: imageUrls,
      createdBy: req.user.id,
      createdByRole: req.user.role,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================
   UPDATE PRODUCT
===================== */
export const updateProduct = async (req: any, res: Response) => {
  try {
    const updateData: any = { ...req.body };

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map((file: Express.Multer.File) =>
          uploadBufferToCloudinary(file.buffer, "products")
        )
      );

      updateData.$push = {
        images: { $each: imageUrls },
      };
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Product updated",
      product,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Update product failed",
      err: err.message,
    });
  }
};


/* =====================
   DELETE PRODUCT
===================== */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({ message: "Product deleted" });
  } catch (err: any) {
    res.status(500).json({
      message: "Delete product failed",
      err: err.message,
    });
  }
};

//get particular service provider product 
export const getMyProducts = async (req: any, res: Response) => {
  try {
    let filter: any = { isDeleted: false };

    // Provider → only own products
    if (req.user.role === "provider") {
      filter.createdBy = req.user.id;
    }

    // Admin → all products (no createdBy filter)

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

export const getActiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      status: "Active",
      isDeleted: false,
    })
      
    res.json({
      message: "Active products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to fetch active products",
      error: err.message,
    });
  }
};

export const toggleWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isProductInWishlist = user.wishlist.some(
      (id: any) => id.toString() === productId
    );

    if (isProductInWishlist) {
      // REMOVE
      user.wishlist = user.wishlist.filter(
        (id: any) => id.toString() !== productId
      );
    } else {
      // ADD
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({
      message: isProductInWishlist
        ? "Product removed from wishlist"
        : "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Wishlist toggle failed",
      error: err.message,
    });
  }
};

export const toggleCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartIndex = user.cart.findIndex(
      (item: any) => item.product.toString() === productId
    );

    /* =====================
       CART LOGIC
    ===================== */

    // REMOVE if quantity = 0
    if (cartIndex > -1 && quantity === 0) {
      user.cart.splice(cartIndex, 1);
    }

    // UPDATE quantity if product exists
    else if (cartIndex > -1 && quantity > 0) {
      user.cart[cartIndex].quantity = quantity;
    }

    // ADD new product
    else if (cartIndex === -1 && quantity > 0) {
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    await user.save();

    res.json({
      message:
        quantity === 0
          ? "Product removed from cart"
          : cartIndex > -1
          ? "Cart quantity updated"
          : "Product added to cart",
      cart: user.cart,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Cart update failed",
      error: err.message,
    });
  }
};