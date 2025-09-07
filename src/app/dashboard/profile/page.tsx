
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {mockPosts, mockUsers} from '@/lib/mock-data';
import PostCard from '@/components/post-card';
import EditProfileForm from './components/edit-profile-form';
import {Users} from 'lucide-react';

const mockCommunities = [
  {id: 'c1', name: 'Global Climate Action', memberCount: 1200, imageUrl: 'https://picsum.photos/seed/c1/200/200'},
  {id: 'c2', name: 'Local Gardeners', memberCount: 150, imageUrl: 'https://picsum.photos/seed/c2/200/200'},
];

export default function ProfilePage() {
  const user = mockUsers[0];
  const userPosts = mockPosts.filter(p => p.userId === user.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const savedPosts = mockPosts.filter(p => user.savedPosts.includes(p.id)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const userCommunities = mockCommunities.filter(c =>
    user.communities.includes(c.id)
  );

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
            <EditProfileForm user={user} />
          </div>
          <div className="pt-12">
            <h1 className="text-2xl font-bold font-headline">
              {user.username}
            </h1>
            <p className="text-muted-foreground">
              @{user.username.toLowerCase()}
            </p>
            <p className="mt-2 text-sm">
              Passionate about creating a sustainable future. Let&apos;s
              connect and collaborate for a greener planet! 🌍💚
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="space-y-6 mt-6">
            {userPosts.map(post => {
              const postUser = mockUsers.find(u => u.id === post.userId);
              if (!postUser) return null;
              return <PostCard key={post.id} post={post} user={postUser} />;
            })}
             {userPosts.length === 0 && <p className="text-muted-foreground text-center py-8">No posts yet.</p>}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="space-y-6 mt-6">
            {savedPosts.map(post => {
              const postUser = mockUsers.find(u => u.id === post.userId);
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
