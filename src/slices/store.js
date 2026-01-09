import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import productReducer from './productSlice'
import billingReducer from './billingSlice'
import salesReducer from './salesSlice'
import reportReducer from './reportSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    billing: billingReducer,
    sales: salesReducer,
    reports: reportReducer,
  },
})

export default store
