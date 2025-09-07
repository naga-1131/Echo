
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Notification, User, Post } from '@/lib/types';
import { mockNotifications } from '@/lib/mock-data';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: { type: 'like' | 'comment' | 'follow'; fromUser: User; post?: Post }) => void;
  markAsRead: (notificationId: string) => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addNotification = ({ type, fromUser, post }: { type: 'like' | 'comment' | 'follow'; fromUser: User; post?: Post }) => {
    const newNotification: Notification = {
      id: `n${Date.now()}`,
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markAsRead, unreadCount }}>
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
