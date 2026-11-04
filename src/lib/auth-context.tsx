"use client";
// src/lib/auth-context.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  User, sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Admin: any authenticated user (restrict further via Firebase Security Rules)
  const isAdmin = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, resetPassword, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
