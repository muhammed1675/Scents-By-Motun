import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import { User } from '../types';
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  signup as signupService,
  updateProfile as updateProfileService } from
'../services';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ok: boolean;message?: string;}>;
  signup: (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ok: boolean;message?: string;}>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().
    then(setUser).
    finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginService(email, password);
    if (result.ok && result.user) setUser(result.user);
    return { ok: result.ok, message: result.message };
  }, []);

  const signup = useCallback(
    async (input: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      const result = await signupService(input);
      if (result.ok && result.user) setUser(result.user);
      return { ok: result.ok, message: result.message };
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<User>) => {
    const updated = await updateProfileService(patch);
    setUser(updated);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, signup, logout, updateProfile, setUser }),
    [user, isLoading, login, signup, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}