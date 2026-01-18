import { createSlice } from "@reduxjs/toolkit";

interface ServiceProviderState {
  application: any | null;
  loading: boolean;
}

const initialState: ServiceProviderState = {
  application: null,
  loading: false,
};

const serviceProviderSlice = createSlice({
  name: "serviceProvider",
  initialState,
  reducers: {
    setApplication(state, action) {
      state.application = action.payload;
    },
    clearApplication(state) {
      state.application = null;
    },
  },
});

export const { setApplication, clearApplication } =
  serviceProviderSlice.actions;

export default serviceProviderSlice.reducer;
