import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import Provider from "../features/provider/providerSlice"
import productReducer from "../features/product/productSlice"
import orderReducer from "../features/order/orderSlice"
import adminReducer from "../features/admin/adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    provider: Provider,
    products: productReducer,
    orders: orderReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;