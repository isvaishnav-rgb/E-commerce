import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  forgotPasswordApi,
  resetPasswordApi,
} from "../../api/auth.api";

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgot-password",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/reset-password",
  async (
    data: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await resetPasswordApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Password reset failed"
      );
    }
  }
);