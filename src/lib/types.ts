

export interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  bio?: string;
  savedPosts: string[];
  communities: string[];
  followers: string[];
  following: string[];
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
  id:string;
  userId: string;
  text: string;
  timestamp: Date;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  memberCount: number;
  adminId: string;
}

export type WasteType = 'overflowing-bin' | 'plastic-dump' | 'e-waste' | 'litter' | 'other';

export interface WasteReport {
  id: string;
  userId: string;
  photoUrl: string;
  description: string;
  wasteType: WasteType;
  location: { lat: number; lng: number };
  status: 'open' | 'in-progress' | 'closed';
  timestamp: Date;
  aiSuggestion?: string;
}

export interface Notification {
  id: string;
  forUserId: string;
  type: 'like' | 'comment' | 'follow';
  fromUser: User;
  post?: Post;
  timestamp: Date;
  read: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
}

export interface Conversation {
    id: string;
    participants: string[];
    messages: Message[];
    lastMessageTimestamp: Date;
}
