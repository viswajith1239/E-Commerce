import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';

const API_URL = '/api/orders';

// Create order

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Sending order payload:', JSON.stringify(orderData, null, 2)); // Debug
      const response = await fetch('/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data.order;
    } catch (error) {
      console.error('Order thunk error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Get user's orders
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/my-orders`);
      console.log('Orders response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

// Get single order
export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  orders: null,
  order: null,
  isLoading: false,
  error: null,
  success: false,
  clientSecret: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearClientSecret: (state) => {
      state.clientSecret = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.order = action.payload.order;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create order';
      })
      // Get user's orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload.orders || [];
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch orders';
        state.orders = [];
      })
      // Get single order
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch order';
      });
  }
});

export const { clearError, clearSuccess, clearClientSecret } = orderSlice.actions;
export default orderSlice.reducer; 