

"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PostCard from '@/components/post-card';
import { useUser } from '@/app/dashboard/components/user-provider';
import { usePosts } from '@/app/dashboard/components/posts-provider';
import { mockUsers } from '@/lib/mock-data';
import type { User as UserType } from '@/lib/types';
import { UserPlus, UserCheck } from 'lucide-react';
import UserListDialog from '../../components/user-list-dialog';
import { useNotifications } from '../../components/notifications-provider';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = params;
  
  const { user: currentUser, updateUser } = useUser();
  const { posts } = usePosts();
  const { addNotification } = useNotifications();
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  
  useEffect(() => {
    if (userId) {
      if (userId === currentUser?.id) {
        router.push('/dashboard/profile');
        return;
      }
      const foundUser = mockUsers.find(u => u.id === userId);
      setProfileUser(foundUser ? {...foundUser} : null); // Create a copy to avoid direct mutation
    }
  }, [userId, currentUser, router]);

  if (!profileUser || !currentUser) {
    return <div>Loading...</div>;
  }

  const userPosts = posts.filter(p => p.userId === profileUser.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const isFollowing = currentUser.following.includes(profileUser.id);

  const handleFollowToggle = () => {
    if (!profileUser || !currentUser) return;
    const newIsFollowing = !isFollowing;

    if (newIsFollowing) {
      // Follow
      updateUser({ following: [...currentUser.following, profileUser.id] });
      setProfileUser(prev => prev ? { ...prev, followers: [...prev.followers, currentUser.id] } : null);
       addNotification({
          type: 'follow',
          fromUser: currentUser,
        });
    } else {
      // Unfollow
      updateUser({ following: currentUser.following.filter(id => id !== profileUser.id) });
      setProfileUser(prev => prev ? { ...prev, followers: prev.followers.filter(id => id !== currentUser.id) } : null);
    }
  };

  const getFollowers = (): UserType[] => {
    if (!profileUser) return [];
    return mockUsers.filter(u => profileUser.followers.includes(u.id));
  }

  const getFollowing = (): UserType[] => {
      if (!profileUser) return [];
      return mockUsers.filter(u => profileUser.following.includes(u.id));
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-green-400" />
        <CardContent className="p-4 relative">
          <Avatar className="h-24 w-24 absolute -top-12 left-6 border-4 border-card">
            <AvatarImage
              src={profileUser.profilePic}
              alt={profileUser.username}
              data-ai-hint="user avatar"
            />
            <AvatarFallback>{profileUser.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex justify-end mb-4">
             <Button onClick={handleFollowToggle} variant={isFollowing ? 'secondary' : 'default'}>
                {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
          <div className="pt-12">
            <h1 className="text-2xl font-bold font-headline">
              {profileUser.username}
            </h1>
            <p className="text-muted-foreground">
              @{profileUser.username.toLowerCase()}
            </p>
            <p className="mt-2 text-sm">
              {profileUser.bio}
            </p>
             <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                <button onClick={() => setFollowingOpen(true)} className="flex items-center gap-1 hover:underline">
                    <span className="font-bold text-foreground">{profileUser.following.length}</span> Following
                </button>
                 <button onClick={() => setFollowersOpen(true)} className="flex items-center gap-1 hover:underline">
                    <span className="font-bold text-foreground">{profileUser.followers.length}</span> Followers
                </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UserListDialog open={followingOpen} onOpenChange={setFollowingOpen} title="Following" users={getFollowing()} />
      <UserListDialog open={followersOpen} onOpenChange={setFollowersOpen} title="Followers" users={getFollowers()} />

       <div className="space-y-6 mt-6">
        <h2 className="text-xl font-bold font-headline">Posts</h2>
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} user={profileUser} />
        ))}
        {userPosts.length === 0 && <p className="text-muted-foreground text-center py-8">This user hasn't posted yet.</p>}
      </div>
    </div>
  );
}
