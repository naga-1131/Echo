
"use client";

import Image from "next/image";
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, Repeat, Bookmark, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import type { Post, User } from "@/lib/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CommentSection from "./comment-section";
import { useUser } from "@/app/dashboard/components/user-provider";
import { usePosts } from "@/app/dashboard/components/posts-provider";
import { useNotifications } from "@/app/dashboard/components/notifications-provider";

interface PostCardProps {
  post: Post;
  user: User;
}

export default function PostCard({ post, user }: PostCardProps) {
  const { user: currentUser, updateUser } = useUser();
  const { deletePost, updatePost } = usePosts();
  const { addNotification } = useNotifications();

  const [isLiked, setIsLiked] = useState(currentUser ? post.likes.includes(currentUser.id) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isSaved, setIsSaved] = useState(currentUser ? currentUser.savedPosts.includes(post.id) : false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(post.likes.includes(currentUser.id));
      setIsSaved(currentUser.savedPosts.includes(post.id));
      setLikeCount(post.likes.length);
    }
  }, [post, currentUser]);


  const handleLike = () => {
    if (!currentUser) return;
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    
    const newLikes = newIsLiked 
      ? [...post.likes, currentUser.id]
      : post.likes.filter(id => id !== currentUser.id);
    
    updatePost(post.id, { likes: newLikes });

    if (newIsLiked && post.userId !== currentUser.id) {
      addNotification({
        type: 'like',
        fromUser: currentUser,
        post,
        forUserId: post.userId,
      });
    }
  };

  const handleSave = () => {
    if (!currentUser) return;
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    if (newIsSaved) {
        updateUser({ savedPosts: [...currentUser.savedPosts, post.id] });
    } else {
        updateUser({ savedPosts: currentUser.savedPosts.filter(id => id !== post.id) });
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
  }

  const handleCommentAdded = () => {
    if (!currentUser) return;
    // Don't notify if commenting on own post
    if (currentUser.id !== post.userId) {
       addNotification({
        type: 'comment',
        fromUser: currentUser,
        post,
        forUserId: post.userId
      });
    }
  }

  const isOwnPost = currentUser?.id === post.userId;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={isOwnPost ? `/dashboard/profile` : `/dashboard/profile/${user.id}`}>
          <Avatar>
            <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
           <Link href={isOwnPost ? `/dashboard/profile` : `/dashboard/profile/${user.id}`} className="font-semibold hover:underline">{user.username}</Link>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
         {isOwnPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
          <Button variant="ghost" size="sm" onClick={handleSave} className="flex items-center gap-2" disabled={!currentUser}>
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-primary text-primary")} />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        {showComments && <CommentSection postId={post.id} comments={post.comments} onCommentAdded={handleCommentAdded} />}
      </CardFooter>
    </Card>
  );
}
