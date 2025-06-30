"use client";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../../redux/store';
import { 
  initializeAuth, 
  loginUser, 
  registerUser, 
  logoutUser,
  verifyToken,
  selectAuth,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectRole,
  selectAuthLoading,
  selectAuthError
} from '../../redux/auth/authSlice';

/**
 * Custom hook for authentication management
 * Provides authentication state and actions
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Initialize auth state on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Actions
  const login = async (email: string, password: string) => {
    return dispatch(loginUser({ email, password }));
  };

  const register = async (email: string, password: string) => {
    return dispatch(registerUser({ email, password }));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  const verify = (token: string) => {
    return dispatch(verifyToken(token));
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    role,
    isLoading,
    error,
    auth,
    
    // Actions
    login,
    register,
    logout,
    verify,
  };
};

/**
 * Hook for role-based access control
 * @param requiredRole - The minimum role required
 * @returns boolean indicating if user has access
 */
export const useRoleAccess = (requiredRole?: 'admin' | 'creator' | 'user') => {
  const role = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated || !requiredRole) {
    return isAuthenticated;
  }

  const roleHierarchy = {
    admin: 3,
    creator: 2,
    user: 1
  };

  const userRoleLevel = roleHierarchy[role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
};

/**
 * Hook to check if user has specific permissions
 */
export const usePermissions = () => {
  const role = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const permissions = {
    canRead: isAuthenticated,
    canWrite: isAuthenticated && ['admin', 'creator'].includes(role),
    canDelete: isAuthenticated && role === 'admin',
    canManageUsers: isAuthenticated && role === 'admin',
    canUpload: isAuthenticated && ['admin', 'creator'].includes(role),
    canModerate: isAuthenticated && ['admin', 'creator'].includes(role),
    isAdmin: isAuthenticated && role === 'admin',
    isCreator: isAuthenticated && role === 'creator',
    isUser: isAuthenticated && role === 'user'
  };

  return permissions;
};

export default useAuth;
