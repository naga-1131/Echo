
import PostCard from "@/components/post-card";
import { mockPosts, mockUsers } from "@/lib/mock-data";

export default function DashboardPage() {
  const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="space-y-6">
        {sortedPosts.map((post) => {
          const user = mockUsers.find((u) => u.id === post.userId);
          if (!user) return null;
          return <PostCard key={post.id} post={post} user={user} />;
        })}
      </div>
    </div>
  );
}
