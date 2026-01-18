import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setWishlist: (state, action) => {
      if (state.user) {
        state.user.wishlist = action.payload;
      }
    },

    setCart: (state, action) => {
      if (state.user) {
        state.user.cart = action.payload;
      }
    },
  },
});

export const {
  loginSuccess,
  logout,
  setUser,
  setWishlist,
  setCart,
  setAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
