
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "./user-provider";

export default function SidebarUser() {
    const { user } = useUser();

    if (!user) return null;

    return (
        <div className="flex items-center gap-2">
            <Avatar className="size-8">
                <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username}</span>
                <span className="text-xs text-muted-foreground">Logout</span>
            </div>
        </div>
    );
}
