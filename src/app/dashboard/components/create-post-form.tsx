
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";

interface CreatePostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostForm({ open, onOpenChange }: CreatePostFormProps) {
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePostSubmit = () => {
    console.log("New Post:", { postContent, image: imagePreview ? "Image attached" : "No image" });
    // Here you would typically call a server action to create the post
    setPostContent("");
    setImagePreview(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a new post</SheetTitle>
          <SheetDescription>
            Share your thoughts, updates, or photos with the community.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="post-content">Your message</Label>
            <Textarea
              id="post-content"
              placeholder="What's on your mind?"
              className="col-span-3 min-h-[120px]"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="post-photo">Add a photo</Label>
            <Input id="post-photo" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview ? (
              <div className="relative group">
                <Image src={imagePreview} alt="Selected preview" width={400} height={225} className="rounded-md object-cover w-full aspect-video" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => setImagePreview(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
                <Label htmlFor="post-photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                           Click to upload an image
                        </p>
                    </div>
                </Label>
            )}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" onClick={handlePostSubmit} disabled={!postContent.trim()}>
            Post
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
