"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister, getCurrentUser, getTwitterStatus } from "./api";
import { User, AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [twitterConnected, setTwitterConnected] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("sp_token");
    if (!storedToken) {
      setLoading(false);
      setTwitterConnected(false);
      return;
    }

    setToken(storedToken);
    (async () => {
      try {
        const userData = await getCurrentUser();
        const userObj = userData?.user ?? userData;
        setUser(userObj || null);
      } catch (e) {
        localStorage.removeItem("sp_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      try {
        const res = await getTwitterStatus();
        if (!mounted) return;
        setTwitterConnected(!!res?.connected);
      } catch (e) {
        if (!mounted) return;
        setTwitterConnected(false);
      }
    };

    if (!token) {
      setTwitterConnected(false);
    } else {
      checkStatus();
      interval = setInterval(checkStatus, 30000);
    }

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, [token]);



  const login = async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    localStorage.setItem("sp_token", data.token);
    setToken(data.token);

    try {
      const userData = await getCurrentUser();
      const userObj = userData?.user ?? userData ?? { email };
      setUser(userObj);
    } catch (e) {
      setUser({ email });
    }

    router.push("/dashboard");
  };

  const register = async (email: string, password: string) => {
    const data = await apiRegister({ email, password });
    localStorage.setItem("sp_token", data.token);
    setToken(data.token);

    try {
      const userData = await getCurrentUser();
      const userObj = userData?.user ?? userData ?? { email };
      setUser(userObj);
    } catch (e) {
      setUser({ email });
    }

    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("sp_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        twitterConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
