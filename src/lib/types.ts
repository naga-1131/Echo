
export interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  savedPosts: string[];
  communities: string[];
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  tags?: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: string[];
  repostOf?: string;
  communityId?: string;
  timestamp: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: string[];
  adminId: string;
}

export interface WasteReport {
  id: string;
  userId: string;
  photoUrl: string;
  description: string;
  location: { lat: number; lng: number };
  status: 'open' | 'in-progress' | 'closed';
  timestamp: Date;
}
