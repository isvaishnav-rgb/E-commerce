import { createSlice } from "@reduxjs/toolkit";
import { fetchProviders, fetchUsers, fetchProducts, fetchApplications, fetchApplicationById, approveApplication, rejectApplication, fetchOrders } from "./adminThunk";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    providers: [],
    users: [],
    products: [],
    applications: [],
    orders: [],
    selectedApplication: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload.data || action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch providers";
      })
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications || action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })
      // Fetch Application By ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedApplication = action.payload.application || action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch application details";
      })
      // Approve Application
      .addCase(approveApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveApplication.fulfilled, (state: any, action) => {
        state.loading = false;
        const updatedApp = action.payload.application;
        state.applications = state.applications.map((app: any) => 
          app._id === updatedApp._id ? updatedApp : app
        );
      })
      .addCase(approveApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to approve application";
      })
      // Reject Application
      .addCase(rejectApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectApplication.fulfilled, (state: any, action) => {
        state.loading = false;
        const updatedApp = action.payload.application;
        state.applications = state.applications.map((app: any) => 
          app._id === updatedApp._id ? updatedApp : app
        );
      })
      .addCase(rejectApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reject application";
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
