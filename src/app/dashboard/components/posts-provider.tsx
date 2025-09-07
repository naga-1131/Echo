
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Post } from '@/lib/types';
import { mockPosts, mockUsers } from '@/lib/mock-data';

interface PostsContextType {
  posts: Post[];
  addPost: (post: { text: string; mediaUrl?: string }) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const currentUser = mockUsers[0];

  const addPost = ({ text, mediaUrl }: { text: string; mediaUrl?: string }) => {
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

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
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
