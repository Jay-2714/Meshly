"use client"
import { configureStore } from '@reduxjs/toolkit';
import roleReducer from "./roles/roleSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
    reducer: {
        role: roleReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
