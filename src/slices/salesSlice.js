import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

const initialState = {
  sales: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all sales (Admin)
export const getAllSales = createAsyncThunk('sales/getAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/admin/sales');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sales = action.payload;
      })
      .addCase(getAllSales.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = salesSlice.actions;
export default salesSlice.reducer;
