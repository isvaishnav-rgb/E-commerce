import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getActiveProductsApi,
  toggleWishlistApi,
  toggleCartApi,
} from "../../api/product.api";
import { setWishlist, setCart } from "../auth/authSlice";

interface ProductState {
  products: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,
};

/* =====================
   THUNKS
===================== */

export const fetchActiveProducts = createAsyncThunk(
  "products/fetchActive",
  async () => {
    return await getActiveProductsApi();
  }
);

export const toggleWishlist = createAsyncThunk(
  "product/toggleWishlist",
  async (productId: string, { dispatch }) => {
    const res = await toggleWishlistApi(productId);

    // ✅ STORE IN USER SLICE
    dispatch(setWishlist(res.wishlist));

    return res.wishlist;
  }
);

/* =====================
   TOGGLE CART
===================== */
export const toggleCart = createAsyncThunk(
  "product/toggleCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { dispatch }
  ) => {
    const res = await toggleCartApi(productId, quantity);

    // ✅ STORE IN USER SLICE
    dispatch(setCart(res.cart));

    return res.cart;
  }
);

/* =====================
   SLICE
===================== */

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchActiveProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;

