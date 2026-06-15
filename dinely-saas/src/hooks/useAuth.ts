"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "owner" | "customer";
  restaurantId?: string;
  favourites?: string[];
  address?: string;
  avatar?: string;
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
      setState({ user: user as unknown as User | null, loading: false, error: null });
    } catch {
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string, redirectTo?: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { user } = await authApi.login({ email, password });
      const typedUser = user as unknown as User;
      setState({ user: typedUser, loading: false, error: null });
      if (redirectTo) {
        router.push(redirectTo);
      } else if (typedUser.role === "owner") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Login failed",
      }));
    }
  };

  // ── Register (owner) ───────────────────────────────────────────────────────
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

  // ── Register (customer) ────────────────────────────────────────────────────
  const registerCustomer = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authApi.registerCustomer(data);
      await fetchMe();
      router.push("/home");
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Registration failed",
      }));
    }
  };

  // ── Update profile ─────────────────────────────────────────────────────────
  const updateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { user } = await authApi.updateProfile(data);
      setState({
        user: user as unknown as User,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Update failed",
      }));
      throw err;
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
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
    registerCustomer,
    updateProfile,
    logout,
    isOwner: state.user?.role === "owner",
    isCustomer: state.user?.role === "customer",
    refresh: fetchMe,
  };
}
