import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

const initialState = {
  cart: [],
  bills: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createdBillId: null,
  createdBill: null,
};

export const createBill = createAsyncThunk('billing/create', async (billData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/shop/bill', billData);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const getMySales = createAsyncThunk('billing/getMySales', async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/shop/history');
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
});

export const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addToCart: (state, action) => {
        const item = action.payload;
        const existItem = state.cart.find((x) => x.productId === item.productId);

        if (existItem) {
            state.cart = state.cart.map((x) =>
                x.productId === existItem.productId ? { ...x, quantity: x.quantity + 1 } : x
            );
        } else {
            state.cart = [...state.cart, { ...item, quantity: 1 }];
        }
    },
    removeFromCart: (state, action) => {
        state.cart = state.cart.filter((x) => x.productId !== action.payload);
    },
    clearCart: (state) => {
        state.cart = [];
    },
    reset: (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.createdBillId = null;
        state.createdBill = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = []; 
        state.createdBillId = action.payload.id;
        state.createdBill = action.payload;
      })
      .addCase(createBill.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMySales.fulfilled, (state, action) => {
          state.bills = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, clearCart, reset } = billingSlice.actions;
export default billingSlice.reducer;
