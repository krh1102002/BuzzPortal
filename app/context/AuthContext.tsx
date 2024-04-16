"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext: React.FC<AuthContextProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthContext;
