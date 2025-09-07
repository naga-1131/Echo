
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useWasteReports } from "./waste-reports-provider";
import { useUser } from "../../components/user-provider";

interface ReportWasteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportWasteForm({ open, onOpenChange }: ReportWasteFormProps) {
  const { user } = useUser();
  const { addReport } = useWasteReports();
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setIsLocating(true);
      setError("");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (err) => {
          console.error(err);
          setError("Could not get your location. Please enable location services.");
          setIsLocating(false);
        }
      );
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setDescription("");
    setPhoto(null);
    setLocation(null);
    setError("");
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = () => {
    if (!description || !photo || !location || !user) {
        setError("Please fill all fields and ensure location is set.");
        return;
    };
    
    addReport({
        userId: user.id,
        description,
        photoUrl: photo,
        location,
    });

    clearForm();
    onOpenChange(false);
  }

  const isSubmitDisabled = !description || !photo || !location || isLocating;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) clearForm();
    }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Report a Waste Spot</SheetTitle>
          <SheetDescription>
            Help keep our community clean. Fill out the details below to report a waste issue.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Overflowing bin, illegal dumping..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleImageChange} ref={fileInputRef} />
             {photo ? (
              <div className="relative group">
                <Image src={photo} alt="Selected preview" width={400} height={225} className="rounded-md object-cover w-full aspect-video" data-ai-hint="waste trash" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => setPhoto(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
                <Label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                           Click to upload an image
                        </p>
                    </div>
                </Label>
            )}
          </div>
           <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center gap-2 h-10 px-3 py-2 text-sm rounded-md border border-input bg-muted">
                {isLocating ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Getting your location...</span>
                    </>
                ) : location ? (
                    <span>{`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`}</span>
                ) : (
                    <span className="text-destructive">Location access denied.</span>
                )}
            </div>
          </div>
           {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitDisabled}>
            Submit Report
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
