
"use client";

import Link from 'next/link';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useNotifications } from '@/app/dashboard/components/notifications-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
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
            return `liked your post: "${notification.post?.text?.substring(0, 30)}..."`;
        case 'comment':
            return `commented on your post: "${notification.post?.text?.substring(0, 30)}..."`;
        case 'follow':
            return `started following you.`;
        default:
            return 'New notification';
    }
}

function getNotificationLink(notification: Notification): string {
    if (notification.type === 'follow') {
      return `/dashboard/profile/${notification.fromUser.id}`;
    }
    // For a real app, this would be `/post/${notification.post.id}`
    return `/dashboard`;
}

export default function NotificationsPage() {
    const { notifications, markAllAsRead, markAsRead, unreadCount } = useNotifications();
    const router = useRouter();

    const groupedNotifications = notifications.reduce((acc, notification) => {
        const date = new Date(notification.timestamp);
        let group: string;
        if (isToday(date)) {
            group = 'Today';
        } else if (isYesterday(date)) {
            group = 'Yesterday';
        } else {
            group = format(date, 'MMMM d, yyyy');
        }

        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(notification);
        return acc;
    }, {} as Record<string, Notification[]>);

    const handleNotificationClick = (n: Notification) => {
        if (!n.read) {
            markAsRead(n.id);
        }
        router.push(getNotificationLink(n));
    }

    return (
        <div className="container mx-auto max-w-3xl">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-headline flex items-center gap-2">
                           <Bell /> Notifications
                        </CardTitle>
                        <CardDescription>
                            Here's what you've missed.
                        </CardDescription>
                    </div>
                    {unreadCount > 0 && (
                        <Button onClick={() => markAllAsRead()} disabled={unreadCount === 0}>
                            <CheckCheck className="mr-2 h-4 w-4"/>
                            Mark all as read
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {Object.keys(groupedNotifications).length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12 mb-4" />
                            <p className="text-lg font-semibold">All caught up!</p>
                            <p>You have no new notifications.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedNotifications).map(([date, notifs]) => (
                                <div key={date}>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">{date}</h3>
                                    <ul className="space-y-2">
                                        {notifs.map(n => (
                                            <li key={n.id}>
                                                <button onClick={() => handleNotificationClick(n)} className={cn(
                                                    "w-full text-left block p-3 rounded-lg transition-colors hover:bg-muted",
                                                    !n.read && "bg-primary/5"
                                                )}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="relative">
                                                             <Avatar className="h-10 w-10">
                                                                <AvatarImage src={n.fromUser.profilePic} alt={n.fromUser.username} />
                                                                <AvatarFallback>{n.fromUser.username.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full border">
                                                                <NotificationIcon type={n.type} />
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm">
                                                                <span className="font-semibold">{n.fromUser.username}</span>
                                                                {' '}{getNotificationMessage(n)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(new Date(n.timestamp), 'h:mm a')}
                                                            </p>
                                                        </div>
                                                        {!n.read && (
                                                            <div className="h-3 w-3 rounded-full bg-primary mt-1" aria-label="Unread"></div>
                                                        )}
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
