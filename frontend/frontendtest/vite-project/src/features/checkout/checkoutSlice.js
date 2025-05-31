import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';

const initialState = {
  paymentIntent: null,
  clientSecret: null,
  loading: false,
  error: null,
  success: false,
};

// Create Payment Intent Thunk
export const createPaymentIntent = createAsyncThunk(
  'checkout/createPaymentIntent',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/checkout/create-payment-intent', {
        amount,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    resetCheckout: (state) => {
      state.paymentIntent = null;
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.success = true;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create payment intent';
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer; 