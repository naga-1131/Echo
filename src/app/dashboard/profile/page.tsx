import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPosts, mockUsers } from "@/lib/mock-data";
import PostCard from "@/components/post-card";

export default function ProfilePage() {
    const user = mockUsers[0];
    const userPosts = mockPosts.filter(p => p.userId === user.id);
    const savedPosts = mockPosts.filter(p => user.savedPosts.includes(p.id));

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-green-400" />
        <CardContent className="p-4 relative">
          <Avatar className="h-24 w-24 absolute -top-12 left-6 border-4 border-card">
            <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex justify-end mb-4">
            <Button variant="outline">Edit Profile</Button>
          </div>
          <div className="pt-12">
            <h1 className="text-2xl font-bold font-headline">{user.username}</h1>
            <p className="text-muted-foreground">@{user.username.toLowerCase()}</p>
            <p className="mt-2 text-sm">Passionate about creating a sustainable future. Let's connect and collaborate for a greener planet! 🌍💚</p>
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
                    return <PostCard key={post.id} post={post} user={postUser} />
                })}
            </div>
        </TabsContent>
        <TabsContent value="saved">
             <div className="space-y-6 mt-6">
                {savedPosts.map(post => {
                    const postUser = mockUsers.find(u => u.id === post.userId);
                    if (!postUser) return null;
                    return <PostCard key={post.id} post={post} user={postUser} />
                })}
            </div>
        </TabsContent>
        <TabsContent value="communities">
            <Card className="mt-6">
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You are a member of 2 communities.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
