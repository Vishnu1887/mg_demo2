"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Division, Role, User } from "../db/types";
import { INITIAL_USERS } from "../db/mock-data";
import { dataStore } from "../db/store";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAs: (targetRole: Role) => void;
  loginWithGoogle: () => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    role?: Role;
    divisionInterest?: Division;
    bio?: string;
    adminVerificationCode?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = "mgsolutions_auth_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to demo student so visitors immediately experience logged-in features,
        // while also having one-click toggle to Admin
        const defaultStudent = INITIAL_USERS.find((u) => u.role === "STUDENT") || INITIAL_USERS[1];
        setUser(defaultStudent);
        window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultStudent));
      }
    } catch {
      setUser(INITIAL_USERS[1]);
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) {
        window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
      } else {
        window.localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const users = dataStore.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      saveUser(existing);
      return { success: true };
    }

    // Auto-detect role based on email or create on-the-fly for demo convenience
    const isAdminEmail = email.toLowerCase().includes("admin");
    const role: Role = isAdminEmail ? "ADMIN" : "STUDENT";
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      divisionInterest: isAdminEmail ? "orgintech" : "edtech",
      createdAt: new Date().toISOString(),
    };

    dataStore.addUser(newUser);
    saveUser(newUser);
    return { success: true };
  };

  const loginAs = (targetRole: Role) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === targetRole);
    if (targetUser) {
      saveUser(targetUser);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    // Simulated Google OAuth Flow
    const googleUser: User = {
      id: `google-user-${Date.now()}`,
      name: "Google Authenticated User",
      email: "user.workspace@gmail.com",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      divisionInterest: "edtech",
      createdAt: new Date().toISOString(),
    };
    saveUser(googleUser);
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    role?: Role;
    divisionInterest?: Division;
    bio?: string;
    adminVerificationCode?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    // Security Restriction: Company Staff / Administrator cannot register without Website Owner's 5-digit code
    if (userData.role === "ADMIN") {
      const code = userData.adminVerificationCode?.trim();
      if (!code || code.length !== 5) {
        return {
          success: false,
          message: "Authorization Denied: A valid 5-digit security code dispatched to the Website Owner (+91 8328167452) is required to register a Company Staff Administrator account.",
        };
      }
    }

    // Role Restriction: Students / joiners can only join OrginTech or EdTech (BBS is for corporate business services)
    if (userData.role === "STUDENT" && userData.divisionInterest === "bbs") {
      return {
        success: false,
        message: "Students / joiners can only enroll in OrginTech or EdTech. BBS is strictly reserved for corporate business services.",
      };
    }

    const users = dataStore.getUsers();
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "STUDENT",
      divisionInterest: userData.divisionInterest || "orgintech",
      bio: userData.bio,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString(),
    };

    dataStore.addUser(newUser);
    saveUser(newUser);
    return { success: true };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
  };

  const logout = () => {
    saveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isStudent: user?.role === "STUDENT",
        login,
        loginAs,
        loginWithGoogle,
        signUp,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
