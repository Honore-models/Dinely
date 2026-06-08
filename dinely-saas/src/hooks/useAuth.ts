"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "owner" | "customer";
  restaurantId?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const fetchMe = useCallback(async () => {
    try {
      const { user } = await authApi.me();
      setState({ user: user as User | null, loading: false, error: null });
    } catch {
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { user } = await authApi.login({ email, password });
      setState({ user: user as unknown as User, loading: false, error: null });
      router.push("/dashboard");
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Login failed",
      }));
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authApi.register(data);
      await fetchMe();
      router.push("/onboarding/step-1");
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Registration failed",
      }));
    }
  };

  const logout = async () => {
    await authApi.logout();
    setState({ user: null, loading: false, error: null });
    router.push("/login");
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    isOwner: state.user?.role === "owner",
  };
}
