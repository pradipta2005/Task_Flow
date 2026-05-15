"use client";

import { createContext, useContext } from "react";

export interface AuthUser {
  userId: string;
  role: string;
}

export const AuthContext = createContext<AuthUser | null>(null);
export const useAuth = () => useContext(AuthContext);
