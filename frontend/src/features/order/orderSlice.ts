import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyOrdersApi } from "../../api/order.api";

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async () => {
    const res = await getMyOrdersApi();
    return res.data.orders;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
