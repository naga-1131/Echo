
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface UserContextType {
  user: User | null;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  login: (userId: string, userObj?: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

   useEffect(() => {
    // Prevent hydration errors by running this on the client only
    if (typeof window !== 'undefined') {
        const storedUserId = localStorage.getItem('loggedInUserId');
        if (storedUserId) {
            const loggedInUser = users.find(u => u.id === storedUserId) || null;
            setUser(loggedInUser);
        }
    }
  }, [users]);

  const addUser = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }

  const login = (userId: string, userObj?: User) => {
    const userToLogin = userObj || users.find(u => u.id === userId);
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
      setUsers(prevUsers => {
          const userIndex = prevUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
              const newUsers = [...prevUsers];
              
              // Handle following/followers logic
              const oldFollowing = prevUsers[userIndex].following;
              const newFollowing = updatedUser.following;

              // If a user was added to following
              const followedId = newFollowing?.find(id => !oldFollowing.includes(id));
              if(followedId) {
                  const followedUserIndex = newUsers.findIndex(u => u.id === followedId);
                  if(followedUserIndex !== -1) {
                      newUsers[followedUserIndex].followers.push(user.id);
                  }
              }

              // If a user was removed from following
              const unfollowedId = oldFollowing?.find(id => !newFollowing?.includes(id));
              if(unfollowedId) {
                  const unfollowedUserIndex = newUsers.findIndex(u => u.id === unfollowedId);
                  if(unfollowedUserIndex !== -1) {
                      newUsers[unfollowedUserIndex].followers = newUsers[unfollowedUserIndex].followers.filter(id => id !== user.id);
                  }
              }

              newUsers[userIndex] = updatedUser;
              return newUsers;
          }
          return prevUsers;
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, users, addUser, updateUser, login, logout }}>
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
