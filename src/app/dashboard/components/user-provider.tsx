
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  login: (userId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    if (storedUserId) {
      const loggedInUser = mockUsers.find(u => u.id === storedUserId) || null;
      setUser(loggedInUser);
    }
  }, []);

  const login = (userId: string) => {
    const userToLogin = mockUsers.find(u => u.id === userId);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('loggedInUserId', userId);
    } else {
      console.error("Login failed: User not found");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUserId');
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Also update the mock data so other components see the change
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if(userIndex !== -1) {
          mockUsers[userIndex] = updatedUser;
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
