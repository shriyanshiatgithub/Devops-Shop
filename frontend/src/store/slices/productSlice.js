import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const { data } = await API.get('/products/');
  return data;
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], selected: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export default productSlice.reducer;
