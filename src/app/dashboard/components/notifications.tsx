
"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle, UserPlus, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from './notifications-provider';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';
import { useRouter } from 'next/navigation';

function NotificationIcon({ type }: { type: Notification['type'] }) {
    switch (type) {
        case 'like':
            return <Heart className="h-4 w-4 text-red-500 fill-current" />;
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
    if (notification.type === 'follow') {
      return `/dashboard/profile/${notification.fromUser.id}`;
    }
    // For likes and comments, a real app would link to the specific post page.
    // We'll just link to the main feed for now.
    return `/dashboard`;
}


export default function Notifications() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const router = useRouter();

  // Show only the 5 most recent notifications in the dropdown
  const recentNotifications = notifications.slice(0, 5);
  
  const handleItemClick = (notification: Notification) => {
    markAsRead(notification.id);
    router.push(getNotificationLink(notification));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <DropdownMenuLabel className="flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} New</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No new notifications</p>
        ) : (
            recentNotifications.map((n) => (
            <DropdownMenuItem key={n.id} onClick={() => handleItemClick(n)} className={cn("p-2 flex items-start gap-3 cursor-pointer", !n.read && "bg-primary/5")}>
                 <div className="relative">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={n.fromUser.profilePic} alt={n.fromUser.username} data-ai-hint="user avatar" />
                        <AvatarFallback>{n.fromUser.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <span className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
                        <NotificationIcon type={n.type} />
                    </span>
                 </div>
                 <div className="flex-1">
                    <p className="text-sm">
                        <span className="font-semibold">{n.fromUser.username}</span>
                        {' '}{getNotificationMessage(n)}
                        {!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary"></span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                    </p>
                </div>
            </DropdownMenuItem>
            ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuFooter>
            <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard/notifications')}>
                <Mail className="mr-2 h-4 w-4" />
                View All Notifications
            </Button>
        </DropdownMenuFooter>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
