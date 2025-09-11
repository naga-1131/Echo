
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { useUser } from '@/app/dashboard/components/user-provider';
import { mockConversations, mockUsers } from '@/lib/mock-data';
import type { Conversation, User, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Video, Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function MessagesPage() {
    const { user: currentUser } = useUser();
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
    const [newMessage, setNewMessage] = useState('');

    if (!currentUser) return <div>Loading...</div>;

    const getOtherParticipant = (convo: Conversation): User | undefined => {
        const otherId = convo.participants.find(p => p !== currentUser.id);
        return mockUsers.find(u => u.id === otherId);
    }
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const message: Message = {
            id: `m${Date.now()}`,
            senderId: currentUser.id,
            text: newMessage,
            timestamp: new Date(),
        };

        const updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
            lastMessageTimestamp: new Date(),
        };

        const updatedConversations = conversations.map(c => 
            c.id === updatedConversation.id ? updatedConversation : c
        ).sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

        setConversations(updatedConversations);
        setSelectedConversation(updatedConversation);
        setNewMessage('');
    }

    const sortedConversations = [...conversations].sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

    return (
        <div className="h-[calc(100vh-100px)] w-full flex border rounded-lg overflow-hidden">
            <aside className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold font-headline">Messages</h2>
                     <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-8" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {sortedConversations.map(convo => {
                        const otherUser = getOtherParticipant(convo);
                        if (!otherUser) return null;
                        const lastMessage = convo.messages[convo.messages.length - 1];
                        return (
                            <button key={convo.id} onClick={() => setSelectedConversation(convo)} className={cn(
                                "flex items-start gap-3 p-4 w-full text-left hover:bg-muted",
                                selectedConversation?.id === convo.id && "bg-muted"
                            )}>
                                <Avatar>
                                    <AvatarImage src={otherUser.profilePic} alt={otherUser.username} />
                                    <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{otherUser.username}</h3>
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(convo.lastMessageTimestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {lastMessage.text}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </ScrollArea>
            </aside>
            <main className="w-2/3 flex flex-col">
                {selectedConversation && getOtherParticipant(selectedConversation) ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center">
                           <div className="flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={getOtherParticipant(selectedConversation)!.profilePic} />
                                <AvatarFallback>{getOtherParticipant(selectedConversation)!.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{getOtherParticipant(selectedConversation)!.username}</h3>
                                <p className="text-xs text-muted-foreground">Online</p>
                            </div>
                           </div>
                           <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon"><Phone /></Button>
                                <Button variant="ghost" size="icon"><Video /></Button>
                           </div>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {selectedConversation.messages.map(msg => (
                                    <div key={msg.id} className={cn(
                                        "flex items-end gap-2",
                                        msg.senderId === currentUser.id ? "justify-end" : "justify-start"
                                    )}>
                                        {msg.senderId !== currentUser.id && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={getOtherParticipant(selectedConversation)!.profilePic} />
                                                <AvatarFallback>{getOtherParticipant(selectedConversation)!.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                         <div className={cn(
                                            "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                                            msg.senderId === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"
                                         )}>
                                            <p className="text-sm">{msg.text}</p>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                            <form className="flex gap-2" onSubmit={handleSendMessage}>
                                <Input 
                                    placeholder="Type a message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" disabled={!newMessage.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mb-4"/>
                        <h2 className="text-2xl font-bold">Your Messages</h2>
                        <p>Select a conversation to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
