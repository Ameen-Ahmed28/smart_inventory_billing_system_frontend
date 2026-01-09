import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

const initialState = {
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new product
export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get all products
export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/shop/products');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get all products (Admin)
export const getAdminProducts = createAsyncThunk('products/getAllAdmin', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/admin/products');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Update product
export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete product
export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/admin/products/${id}`);
    return id;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Optimization: we could append, but refreshing list is safer for consistency
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAdminProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
