import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';

// Async thunk to fetch dashboard data
export const getDashboardData = createAsyncThunk(
    'reports/getDashboardData',
    async (_, thunkAPI) => {
        try {
            // axiosInstance already has the interceptor for the token
            const response = await axios.get('/admin/reports/dashboard');
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    dashboardData: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dashboardData = action.payload;
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;
