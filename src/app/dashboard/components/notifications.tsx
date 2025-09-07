
"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from './notifications-provider';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';

function NotificationIcon({ type }: { type: Notification['type'] }) {
    switch (type) {
        case 'like':
            return <Heart className="h-4 w-4 text-red-500" />;
        case 'comment':
            return <MessageCircle className="h-4 w-4 text-primary" />;
        case 'follow':
            return <UserPlus className="h-4 w-4 text-green-500" />;
        default:
            return null;
    }
}

function getNotificationMessage(notification: Notification): string {
    switch (notification.type) {
        case 'like':
            return `liked your post.`;
        case 'comment':
            return `commented on your post.`;
        case 'follow':
            return `started following you.`;
        default:
            return '';
    }
}

function getNotificationLink(notification: Notification): string {
    if (notification.post) {
        // This is a simplification. Ideally, you'd have a page for a single post.
        return `/dashboard`;
    }
    return `/dashboard/profile/${notification.fromUser.id}`;
}


export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const handleItemClick = (notificationId: string) => {
    markAsRead(notificationId);
  }

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No new notifications</p>
        ) : (
            notifications.map((n) => (
            <DropdownMenuItem key={n.id} asChild className={cn("p-2", !n.read && "bg-blue-50")}>
                <Link href={getNotificationLink(n)} onClick={() => handleItemClick(n.id)} className="flex items-start gap-3 cursor-pointer">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={n.fromUser.profilePic} alt={n.fromUser.username} data-ai-hint="user avatar" />
                        <AvatarFallback>{n.fromUser.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-semibold">{n.fromUser.username}</span>
                            {' '}{getNotificationMessage(n)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                        </p>
                    </div>
                     <NotificationIcon type={n.type} />
                </Link>
            </DropdownMenuItem>
            ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
