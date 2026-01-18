import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    providers: [],
    users: [],
    products: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action: any) => {
          state.loading = false;
          if (action.payload?.providers)
            state.providers = action.payload.providers;
          if (action.payload?.users)
            state.users = action.payload.users;
          if (action.payload?.products)
            state.products = action.payload.products;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default adminSlice.reducer;
