
"use client";

import PostCard from "@/components/post-card";
import { mockUsers } from "@/lib/mock-data";
import { usePosts } from "../components/posts-provider";

export default function SavedPostsPage() {
    const { posts } = usePosts();
    const currentUser = mockUsers[0];
    const savedPosts = posts.filter(p => currentUser.savedPosts.includes(p.id)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
            <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
                <p>You haven't saved any posts yet.</p>
                <p className="text-sm">Click the bookmark icon on a post to save it for later.</p>
            </div>
        )}
      </div>
    </div>
  );
}
