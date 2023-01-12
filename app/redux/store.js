import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import basketReducer from "./slices/basketSlice"

export const store = configureStore({
    reducer: {
        basket: basketReducer,
        auth: authReducer
    }
})