
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/post-card';
import EditProfileForm from './components/edit-profile-form';
import { Users } from 'lucide-react';
import { usePosts } from '../components/posts-provider';
import { useUser } from '../components/user-provider';
import UserListDialog from '../components/user-list-dialog';
import type { User } from '@/lib/types';
import { mockCommunities } from '@/lib/mock-data';

export default function ProfilePage() {
  const { posts } = usePosts();
  const { user, users } = useUser();
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const userPosts = posts.filter(p => p.userId === user.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const savedPosts = posts.filter(p => user.savedPosts.includes(p.id)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const userCommunities = mockCommunities.filter(c =>
    user.communities.includes(c.id)
  );

  const getFollowers = (): User[] => {
    return users.filter(u => user.followers.includes(u.id));
  }

  const getFollowing = (): User[] => {
      return users.filter(u => user.following.includes(u.id));
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-green-400" />
        <CardContent className="p-4 relative">
          <Avatar className="h-24 w-24 absolute -top-12 left-6 border-4 border-card">
            <AvatarImage
              src={user.profilePic}
              alt={user.username}
              data-ai-hint="user avatar"
            />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex justify-end mb-4">
            <EditProfileForm />
          </div>
          <div className="pt-12">
            <h1 className="text-2xl font-bold font-headline">
              {user.username}
            </h1>
            <p className="text-muted-foreground">
              @{user.username.toLowerCase()}
            </p>
            <p className="mt-2 text-sm">
              {user.bio}
            </p>
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                <button onClick={() => setFollowingOpen(true)} className="flex items-center gap-1 hover:underline">
                    <span className="font-bold text-foreground">{getFollowing().length}</span> Following
                </button>
                 <button onClick={() => setFollowersOpen(true)} className="flex items-center gap-1 hover:underline">
                    <span className="font-bold text-foreground">{getFollowers().length}</span> Followers
                </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserListDialog open={followingOpen} onOpenChange={setFollowingOpen} title="Following" users={getFollowing()} />
      <UserListDialog open={followersOpen} onOpenChange={setFollowersOpen} title="Followers" users={getFollowers()} />

      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="space-y-6 mt-6">
            {userPosts.map(post => {
              const postUser = users.find(u => u.id === post.userId) || user;
              return <PostCard key={post.id} post={post} user={postUser} />;
            })}
             {userPosts.length === 0 && <p className="text-muted-foreground text-center py-8">No posts yet.</p>}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="space-y-6 mt-6">
            {savedPosts.map(post => {
              const postUser = users.find(u => u.id === post.userId);
              if (!postUser) return null;
              return <PostCard key={post.id} post={post} user={postUser} />;
            })}
            {savedPosts.length === 0 && <p className="text-muted-foreground text-center py-8">No saved posts yet.</p>}
          </div>
        </TabsContent>
        <TabsContent value="communities">
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            {userCommunities.map(community => (
              <Card key={community.id} className="flex items-center p-4 gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={community.imageUrl} alt={community.name} data-ai-hint="community logo" />
                    <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{community.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1.5 h-4 w-4" />
                    <span>{community.memberCount.toLocaleString()} members</span>
                  </div>
                </div>
              </Card>
            ))}
             {userCommunities.length === 0 && <p className="text-muted-foreground text-center py-8 md:col-span-2">You haven't joined any communities yet.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
