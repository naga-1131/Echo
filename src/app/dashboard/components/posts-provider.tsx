
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Post } from '@/lib/types';
import { mockPosts } from '@/lib/mock-data';
import { useUser } from './user-provider';

interface PostsContextType {
  posts: Post[];
  addPost: (post: { text: string; mediaUrl?: string }) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const { user: currentUser } = useUser();

  const addPost = ({ text, mediaUrl }: { text: string; mediaUrl?: string }) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      text,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      likes: [],
      timestamp: new Date(),
      comments: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
