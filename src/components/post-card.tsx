
"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat, Bookmark, Share2 } from "lucide-react";
import type { Post, User } from "@/lib/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CommentSection from "./comment-section";

interface PostCardProps {
  post: Post;
  user: User;
}

export default function PostCard({ post, user }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{user.username}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="whitespace-pre-wrap">{post.text}</p>
      </CardContent>
      {post.mediaUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={post.mediaUrl}
            alt="Post media"
            fill
            className="object-cover"
            data-ai-hint="social media"
          />
        </div>
      )}
      <CardFooter className="p-2 flex-col items-start">
        <div className="flex w-full justify-around">
          <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-2">
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} className="flex items-center gap-2">
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-primary text-primary")} />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        {showComments && <CommentSection postId={post.id} comments={post.comments} />}
      </CardFooter>
    </Card>
  );
}
