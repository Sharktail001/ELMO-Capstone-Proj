"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, signOut } from "@aws-amplify/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean; // Add loading to the context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        // console.log("User found:", user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("No user found", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false after the check is complete
      }
    }
    checkUser();
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = async () => {
    await signOut();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { isAuthenticated: false, login: () => {}, logout: () => {}, loading: true };
  }
  return context;
};