
'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import type {User} from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EditProfileFormProps {
  user: User;
}

export default function EditProfileForm({user}: EditProfileFormProps) {
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user.profilePic);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <input type="file" id="profile-pic-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
            <Label htmlFor="profile-pic-upload" className="cursor-pointer">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewImage || user.profilePic} alt={user.username} data-ai-hint="user avatar" />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </Label>
            <Button variant="link" asChild>
                <Label htmlFor="profile-pic-upload" className="cursor-pointer">
                    Change profile picture
                </Label>
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue={user.username}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              defaultValue="Passionate about creating a sustainable future. Let's connect and collaborate for a greener planet! 🌍💚"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
