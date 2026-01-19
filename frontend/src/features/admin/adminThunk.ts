import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProviderActivitiesApi,
  getAllUsersApi,
  getAllProductsApi,
  getAllApplicationsApi,
  getApplicationByIdApi,
  reviewProviderApplicationApi,
  approveProviderApplicationApi,
  rejectProviderApplicationApi,
  reviewProductApi,
  removeUserApi,
  getAllOrdersApi,
  updateOrderStatusApi
} from "../../api/admin.api";

export const fetchProviders = createAsyncThunk(
  "admin/fetchProviders",
  async () => {
    const { data } = await getProviderActivitiesApi();
    return data;
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async () => {
    const { data } = await getAllUsersApi();
    return data;
  }
);

export const fetchApplications = createAsyncThunk(
  "admin/fetchApplications",
  async () => {
    console.log("Calling getAllApplicationsApi...");
    const { data } = await getAllApplicationsApi();
    console.log("API response:", data);
    return data;
  }
);

export const fetchApplicationById = createAsyncThunk(
  "admin/fetchApplicationById",
  async (id: string) => {
    const { data } = await getApplicationByIdApi(id);
    return data;
  }
);

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (status?: string) => {
    const { data } = await getAllProductsApi(status);
    return data;
  }
);

export const reviewApplication = createAsyncThunk(
  "admin/reviewApplication",
  async ({ id, status, adminRemark }: { id: string; status: string; adminRemark?: string }) => {
    const { data } = await reviewProviderApplicationApi(id, { status, adminRemark });
    return data;
  }
);

export const reviewProduct = createAsyncThunk(
  "admin/reviewProduct",
  async ({ id, status }: { id: string; status: string }) => {
    const { data } = await reviewProductApi(id, status);
    return data;
  }
);

export const approveApplication = createAsyncThunk(
  "admin/approveApplication",
  async ({ id, adminRemark }: { id: string; adminRemark?: string }) => {
    const { data } = await approveProviderApplicationApi(id, adminRemark);
    return data;
  }
);

export const rejectApplication = createAsyncThunk(
  "admin/rejectApplication",
  async ({ id, adminRemark }: { id: string; adminRemark?: string }) => {
    const { data } = await rejectProviderApplicationApi(id, adminRemark);
    return data;
  }
);

export const removeUser = createAsyncThunk(
  "admin/removeUser",
  async (id: string) => {
    const { data } = await removeUserApi(id);
    return { id, ...data };
  }
);

export const fetchOrders = createAsyncThunk(
  "admin/fetchOrders",
  async () => {
    const { data } = await getAllOrdersApi();
    return data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }: { id: string; status: string }) => {
    const { data } = await updateOrderStatusApi(id, status);
    return data;
  }
);
