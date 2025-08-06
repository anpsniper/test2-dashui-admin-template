'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log('AuthContext: useEffect - Initializing auth state.');
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      console.log('AuthContext: Found stored token in cookies, setting authToken and fetching profile.');
      setAuthToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      console.log('AuthContext: No stored token found in cookies.');
    }
    setLoading(false);
    console.log('AuthContext: Loading set to false.');
  }, []);

  const fetchUserProfile = async (token) => {
    console.log('AuthContext: Attempting to fetch user profile with token.');
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      console.log('AuthContext: User profile fetched successfully:', response.data);
    } catch (error) {
      console.error('AuthContext: Failed to fetch user profile:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    console.log('AuthContext: Attempting login for', email);
    try {
      const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      console.log('AuthContext: Login successful, received token:', access_token);
      Cookies.set('authToken', access_token, { expires: 7 }); // Store token in cookies for 7 days
      setAuthToken(access_token);

      await fetchUserProfile(access_token);
      console.log('AuthContext: Redirecting to /dashboard');
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out.');
    Cookies.remove('authToken'); // Remove token from cookies
    setAuthToken(null);
    setUser(null);
    console.log('AuthContext: Redirecting to /login');
    router.push('/login');
  };

  const authContextValue = {
    authToken,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!authToken,
  };

  console.log('AuthContext: Rendered with isAuthenticated:', authContextValue.isAuthenticated, 'loading:', authContextValue.loading);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};