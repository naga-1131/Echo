

import type { User, Post, WasteReport, Comment, Notification } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'JaneDoe',
    email: 'jane.doe@example.com',
    profilePic: 'https://picsum.photos/id/1027/100/100',
    bio: "Passionate about creating a sustainable future. Let's connect and collaborate for a greener planet! 🌍💚",
    savedPosts: ['p2'],
    communities: ['c1'],
    followers: ['u2'],
    following: ['u2'],
  },
  {
    id: 'u2',
    username: 'JohnSmith',
    email: 'john.smith@example.com',
    profilePic: 'https://picsum.photos/id/1005/100/100',
    bio: 'Eco-innovator and nature enthusiast. Building a better tomorrow, one green step at a time.',
    savedPosts: [],
    communities: ['c1', 'c2'],
    followers: ['u1'],
    following: ['u1'],
  },
];

export const mockComments: Comment[] = [
    { id: 'c1', userId: 'u2', text: 'Great work!', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    { id: 'c2', userId: 'u1', text: 'Thanks for sharing!', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 'c3', userId: 'u2', text: 'Super helpful.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
];


export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    text: 'Just participated in a beach cleanup today! It’s amazing what we can achieve together. 🌊 #beachcleanup #environment',
    mediaUrl: 'https://picsum.photos/seed/p1/600/400',
    mediaType: 'image',
    likes: ['u2'],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    comments: [mockComments[0], mockComments[1]],
  },
  {
    id: 'p2',
    userId: 'u2',
    text: 'Check out this guide to starting your own compost bin at home. It’s easier than you think! 🌱 #composting #sustainability',
    likes: ['u1'],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    comments: [mockComments[2]],
  },
  {
    id: 'p3',
    userId: 'u1',
    text: 'Spotted this beautiful monarch butterfly in my garden today. A small reminder of why protecting our local ecosystems matters. 🦋 #biodiversity #nature',
    mediaUrl: 'https://picsum.photos/seed/p3/600/400',
    mediaType: 'image',
    likes: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    comments: [],
  },
];

export const mockReports: WasteReport[] = [
    {
        id: 'r1',
        userId: 'u1',
        photoUrl: 'https://picsum.photos/seed/r1/300/200',
        description: 'Overflowing dustbin near the park entrance.',
        location: { lat: 12.9716, lng: 77.5946 },
        status: 'open',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
        id: 'r2',
        userId: 'u2',
        photoUrl: 'https://picsum.photos/seed/r2/300/200',
        description: 'Construction debris dumped on the roadside.',
        location: { lat: 12.9750, lng: 77.6000 },
        status: 'in-progress',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
        id: 'r3',
        userId: 'u1',
        photoUrl: 'https://picsum.photos/seed/r3/300/200',
        description: 'Plastic waste collected from the lake shore cleanup.',
        location: { lat: 12.9698, lng: 77.5998 },
        status: 'closed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
];

export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        type: 'like',
        forUserId: 'u1',
        fromUser: mockUsers[1],
        post: mockPosts[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
    },
    {
        id: 'n2',
        type: 'follow',
        forUserId: 'u1',
        fromUser: mockUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
    },
     {
        id: 'n3',
        type: 'comment',
        forUserId: 'u1',
        fromUser: mockUsers[1],
        post: mockPosts[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
    },
]
