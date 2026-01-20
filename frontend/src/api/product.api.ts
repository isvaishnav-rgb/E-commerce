import api from "./axios";
import type { Product } from "../types/Products";

export const createProductApi = async (data: FormData) => {
  const res = await api.post("/product/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProductApi = async (
  id: string,
  data: FormData
) => {
  const res = await api.put(`/product/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductApi = async (id: string) => {
  const res = await api.delete(`/product/${id}`);
  return res.data;
};

export const getMyProductsApi = async () => {
  const res = await api.get("/product/my-products");
  return res.data.products as Product[];
};


export const getActiveProductsApi = async (params: any) => {
    const { data } = await api.get("/product", {params});
  return data;
};

export const toggleWishlistApi = async (productId: string) => {
  const { data } = await api.post("/product/wishlist/toggle", {
    productId,
  });
  return data;
};

export const toggleCartApi = async (
  productId: string,
  quantity: number = 1
) => {
  const { data } = await api.post("/product/cart/toggle", {
    productId,
    quantity,
  });
  return data;
};
