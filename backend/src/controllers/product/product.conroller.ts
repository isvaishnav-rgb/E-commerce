import { Request, Response } from "express";
import Product from "../../models/Product.model";
const uploadBufferToCloudinary = require("../../utils/uploadToCloudinary")

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