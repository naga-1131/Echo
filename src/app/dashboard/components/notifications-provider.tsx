
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Notification, User, Post } from '@/lib/types';
import { mockNotifications } from '@/lib/mock-data';
import { useUser } from './user-provider';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: { type: 'like' | 'comment' | 'follow'; fromUser: User; post?: Post, forUserId: string }) => void;
  markAsRead: (notificationId: string) => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { user } = useUser();

  // Filter notifications for the current user
  const userNotifications = notifications.filter(n => n.forUserId === user?.id);

  const addNotification = ({ type, fromUser, post, forUserId }: { type: 'like' | 'comment' | 'follow'; fromUser: User; post?: Post, forUserId: string }) => {
    // Prevent self-notifications
    if (fromUser.id === forUserId) return;
    
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      forUserId,
      type,
      fromUser,
      post,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };
  
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications: userNotifications, addNotification, markAsRead, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
