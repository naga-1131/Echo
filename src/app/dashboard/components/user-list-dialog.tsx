
"use client";

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  users: User[];
}

export default function UserListDialog({ open, onOpenChange, title, users }: UserListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
            <div className="space-y-4 pr-6 py-2">
            {users.length > 0 ? users.map((user) => (
                <Link
                    href={`/dashboard/profile/${user.id}`}
                    key={user.id}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-muted"
                    onClick={() => onOpenChange(false)}
                >
                    <Avatar>
                        <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground">@{user.username.toLowerCase()}</p>
                    </div>
                </Link>
            )) : <p className="text-muted-foreground text-center py-8">No users to show.</p>}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
