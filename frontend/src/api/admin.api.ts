import axios from "./axios";

/* ================= PROVIDER ================= */

export const getProviderActivitiesApi = () =>
  axios.get("/admin/providers/activity");

export const reviewProviderApplicationApi = (id: string, data: any) =>
  axios.put(`/admin/provider-applications/${id}`, data);

/* ================= USERS ================= */

export const getAllUsersApi = () =>
  axios.get("/admin/users");

/* ================= PRODUCTS ================= */

export const getAllProductsApi = () =>
  axios.get("/products");

export const addProductApi = (data: any) =>
  axios.post("/products", data);

export const updateProductApi = (id: string, data: any) =>
  axios.put(`/products/${id}`, data);

export const deleteProductApi = (id: string) =>
  axios.delete(`/products/${id}`);

/* ================= ORDERS ================= */

export const updateOrderStatusApi = (id: string, status: string) =>
  axios.put(`/admin/orders/${id}/status`, { orderStatus: status });

export const updatePaymentStatusApi = (id: string, status: string) =>
  axios.put(`/admin/orders/${id}/payment`, { paymentStatus: status });


