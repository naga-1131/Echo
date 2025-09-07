
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search as SearchIcon, Users, FileText } from "lucide-react";
import { mockUsers, mockPosts } from "@/lib/mock-data";
import PostCard from "@/components/post-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User, Post } from "@/lib/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<"posts" | "users">("posts");
  
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query) {
      setFilteredPosts(mockPosts.filter((post) =>
        post.text.toLowerCase().includes(query.toLowerCase())
      ));
      setFilteredUsers(mockUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
        setFilteredPosts([]);
        setFilteredUsers([]);
    }
  }, [query]);

  const getPostUser = (userId: string): User | undefined => {
      return mockUsers.find(u => u.id === userId);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect hook will handle filtering
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <form onSubmit={handleSearch} className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for posts or users..."
          className="w-full rounded-lg bg-card pl-10 h-12 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "posts" | "users")} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts"><FileText className="mr-2"/>Posts ({filteredPosts.length})</TabsTrigger>
            <TabsTrigger value="users"><Users className="mr-2"/>Users ({filteredUsers.length})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="min-h-[400px]">
        <CardContent className="p-6">
          {query ? (
            <div>
              {searchType === 'posts' && (
                <div className="space-y-4">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => {
                        const user = getPostUser(post.userId);
                        if (!user) return null;
                        return <PostCard key={post.id} post={post} user={user} />;
                    })
                  ) : (
                    <p className="text-muted-foreground text-center">No posts found for "{query}".</p>
                  )}
                </div>
              )}
              {searchType === 'users' && (
                <div className="space-y-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                        <Avatar>
                          <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
                          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-muted-foreground">@{user.username.toLowerCase()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center">No users found for "{query}".</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground">
                Search results will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
