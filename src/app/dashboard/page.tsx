import PostCard from "@/components/post-card";
import { mockPosts, mockUsers } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <div className="space-y-6">
        {mockPosts.map((post) => {
          const user = mockUsers.find((u) => u.id === post.userId);
          if (!user) return null;
          return <PostCard key={post.id} post={post} user={user} />;
        })}
      </div>
    </div>
  );
}
