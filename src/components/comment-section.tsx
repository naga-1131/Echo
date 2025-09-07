
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/lib/mock-data";
import type { Comment, User } from "@/lib/types";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((user) => user.id === userId);
};

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const currentUser = mockUsers[0]; // Assuming the first user is the current user

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      text: newComment,
      timestamp: new Date(),
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  return (
    <div className="w-full px-4 pt-4 mt-2 border-t">
      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentUser.profilePic} alt={currentUser.username} data-ai-hint="user avatar" />
          <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button type="submit">Post</Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => {
          const user = getUserById(comment.userId);
          if (!user) return null;
          return (
            <div key={comment.id} className="flex gap-2 items-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted p-2 rounded-lg">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </p>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          );
        })}
         {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
            </p>
        )}
      </div>
    </div>
  );
}
