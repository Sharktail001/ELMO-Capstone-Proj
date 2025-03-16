"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, signOut } from "@aws-amplify/auth"; // Ensure you're using AWS Amplify Auth if applicable

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        console.log("User found:", user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("No user found", error);
        setIsAuthenticated(false);
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return { isAuthenticated: false, login: () => {}, logout: () => {} };
    }
    return context;
};