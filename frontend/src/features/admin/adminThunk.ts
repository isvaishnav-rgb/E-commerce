import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProviderActivitiesApi,
  getAllUsersApi,
  getAllProductsApi,
} from "../../api/admin.api";

export const fetchProviders = createAsyncThunk(
  "admin/fetchProviders",
  async () => {
    const { data } = await getProviderActivitiesApi();
    return { providers: data };
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async () => {
    const { data } = await getAllUsersApi();
    return { users: data };
  }
);

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async () => {
    const { data } = await getAllProductsApi();
    return { products: data };
  }
);
