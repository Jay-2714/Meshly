"use client"
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  isCreator: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: 'admin' | 'user' | 'creator';
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: 'user'
};

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    // Clear token from localStorage
    localStorage.removeItem('authToken');
    
    // Clear any other stored auth data
    localStorage.removeItem('user');
    
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Set role based on user data
      if (action.payload.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        state.role = 'admin';
      } else if (action.payload.user.isCreator) {
        state.role = 'creator';
      } else {
        state.role = 'user';
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = 'user';
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRole: (state, action: PayloadAction<'admin' | 'user' | 'creator'>) => {
      state.role = action.payload;
    },
    initializeAuth: (state) => {
      // Only access localStorage on client-side to prevent SSG errors
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            
            // Set role based on stored user data
            if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
              state.role = 'admin';
            } else if (user.isCreator) {
              state.role = 'creator';
            } else {
              state.role = 'user';
            }
          } catch (error) {
            // Clear invalid stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store user data in localStorage
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          
          // Set role
          if (action.payload.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            state.role = 'admin';
          } else if (action.payload.user.isCreator) {
            state.role = 'creator';
          } else {
            state.role = 'user';
          }
        }
        
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        toast.error(action.payload as string || 'Login failed');
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        toast.success('Registration successful! Please verify your email.');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Registration failed');
      })
      // Verify token cases
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = 'user';
        state.error = null;
        toast.success('Logged out successfully');
      });
  },
});

export const { 
  setCredentials, 
  clearCredentials, 
  setError, 
  clearError, 
  setRole,
  initializeAuth 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectRole = (state: { auth: AuthState }) => state.auth.role;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
