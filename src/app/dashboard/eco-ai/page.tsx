
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, User } from "lucide-react";
import { askEcoHelperAction } from "@/app/actions";
import { useUser } from "../components/user-provider";
import { EchoSyncLogo } from "@/components/icons";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function EcoAiPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await askEcoHelperAction(input);
      const botMessage: Message = { sender: "bot", text: result.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting right now.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
   useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);


  return (
    <div className="container mx-auto max-w-3xl h-[calc(100vh-100px)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2">
                <Bot className="h-8 w-8"/>
                <CardTitle className="text-2xl font-headline">Eco AI Assistant</CardTitle>
            </div>
            <CardDescription>Your personal guide to a greener lifestyle. Ask me anything!</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground pt-16">
                  <p>Ask me to generate a post caption, give you eco-tips, or explain a topic!</p>
                  <p className="text-sm">e.g., "Write a post about why recycling is important."</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8 border">
                      <div className="flex items-center justify-center h-full w-full bg-primary/90">
                         <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                   {message.sender === "user" && user && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePic} alt={user.username} data-ai-hint="user avatar" />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border">
                       <div className="flex items-center justify-center h-full w-full bg-primary/90">
                         <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </Avatar>
                    <div className="max-w-md rounded-lg p-3 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Eco AI assistant..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
