import PostCard from "@/components/post-card";
import { mockPosts, mockUsers } from "@/lib/mock-data";

export default function SavedPostsPage() {
    const currentUser = mockUsers[0];
    const savedPosts = mockPosts.filter(p => currentUser.savedPosts.includes(p.id));

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold font-headline mb-6">Saved Posts</h1>
      <div className="space-y-6">
        {savedPosts.length > 0 ? (
            savedPosts.map((post) => {
                const user = mockUsers.find((u) => u.id === post.userId);
                if (!user) return null;
                return <PostCard key={post.id} post={post} user={user} />;
            })
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p>You haven't saved any posts yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
