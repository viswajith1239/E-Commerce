import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity
        });
      }

      state.totalQuantity += quantity;
      state.totalAmount += product.price * quantity;
    },
    removeFromCart: (state, action) => {
      const { _id, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item._id === _id);

      if (existingItem) {
        if (existingItem.quantity <= quantity) {
          state.items = state.items.filter(item => item._id !== _id);
          state.totalQuantity -= existingItem.quantity;
          state.totalAmount -= existingItem.price * existingItem.quantity;
        } else {
          existingItem.quantity -= quantity;
          state.totalQuantity -= quantity;
          state.totalAmount -= existingItem.price * quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find(item => item._id === _id);

      if (item) {
        const quantityDiff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += item.price * quantityDiff;
      }
    }
  }
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer; 