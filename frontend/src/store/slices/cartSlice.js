import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const { data } = await API.get('/cart/');
  return data;
});

export const addToCart = createAsyncThunk('cart/add', async (item) => {
  const { data } = await API.post('/cart/items', item);
  return data;
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId) => {
  const { data } = await API.delete(`/cart/items/${productId}`);
  return data;
});

export const clearCart = createAsyncThunk('cart/clear', async () => {
  await API.delete('/cart/');
  return { items: [], total: 0 };
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      });
  },
});

export default cartSlice.reducer;
