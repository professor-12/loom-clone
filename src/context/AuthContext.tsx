"use client";

import { signOut } from "@/actions/auth.actions";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthType {
      name: string | null;
      id: string;
      email: string;
      avatarUrl?: string | null;
      createdAt?: Date;
}

interface AuthContextValue {
      user: AuthType | null;
      error: string | null;
      status: number;
      loading: boolean;
      signOut: () => Promise<void>;
}

const initialContextValue: AuthContextValue = {
      user: null,
      error: null,
      status: 0,
      loading: true,
      signOut,
};

const AuthContext = createContext<AuthContextValue>(initialContextValue);

export const AuthProvider = ({
      children,
      initialUser,
}: {
      children: React.ReactNode;
      initialUser: AuthType | null;
}) => {
      const [auth, setAuth] = useState<AuthContextValue>({
            ...initialContextValue,
            user: initialUser,
            loading: false,
            status: initialUser ? 200 : 401,
      });

      useEffect(() => {
            if (!initialUser) {
                  (async () => {
                        const data = await import("@/actions/auth.actions").then(m => m.getUser());
                        setAuth({
                              user: data.data ?? null,
                              error: data.error ?? null,
                              status: data.status,
                              loading: false,
                              signOut,
                        });
                  })();
            }
      }, [initialUser]);

      return (
            <AuthContext.Provider value={auth}>
                  {children}
            </AuthContext.Provider>
      );
};

export function useAuth() {
      return useContext(AuthContext);
}
