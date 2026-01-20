import axios from "./axios";

/* ================= PROVIDER ================= */

export const getProviderActivitiesApi = () =>
  axios.get("/admin/applications");

export const reviewProviderApplicationApi = (id: string, data: any) =>
  axios.put(`/admin/provider-applications/${id}`, data);

export const approveProviderApplicationApi = (id: string, adminRemark?: string) =>
  axios.put(`/admin/provider-applications/${id}/approve`, { adminRemark });

export const rejectProviderApplicationApi = (id: string, adminRemark?: string) =>
  axios.put(`/admin/provider-applications/${id}/reject`, { adminRemark });

/* ================= USERS ================= */

export const getAllUsersApi = () =>
  axios.get("/admin/users");

export const removeUserApi = (id: string) =>
  axios.delete(`/admin/users/${id}`);

/* ================= APPLICATIONS ================= */

export const getAllApplicationsApi = () =>
  axios.get("/admin/applications");

export const getApplicationByIdApi = (id: string) =>
  axios.get(`/admin/applications/${id}`);

/* ================= PRODUCTS ================= */

export const getAllProductsApi = (status?: string) =>
  axios.get(`/admin/products${status ? `?status=${status}` : ""}`);

export const reviewProductApi = (id: string, status: string) =>
  axios.put(`/admin/products/${id}/review`, { status });

/* ================= ORDERS ================= */

export const getAllOrdersApi = () =>
  axios.get("/admin/orders");

export const updateOrderStatusApi = (id: string, status: string) =>
  axios.put(`/admin/orders/${id}/status`, { orderStatus: status });

export const addProductApi = (data: any) =>
  axios.post("/product/create", data);

export const updateProductApi = (id: string, data: any) =>
  axios.put(`/product/${id}`, data);

export const deleteProductApi = (id: string) =>
  axios.delete(`/product/${id}`);

/* ================= ORDERS ================= */

export const updatePaymentStatusApi = (id: string, status: string) =>
  axios.put(`/admin/orders/${id}/payment`, { paymentStatus: status });