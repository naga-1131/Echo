"use client";

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

interface ReportWasteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportWasteForm({ open, onOpenChange }: ReportWasteFormProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Report a Waste Spot</SheetTitle>
          <SheetDescription>
            Help keep our community clean. Fill out the details below to report a waste issue.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Overflowing bin, illegal dumping..."
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="photo">Photo</Label>
            <Input id="photo" type="file" accept="image/*" className="col-span-3" />
          </div>
           <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="location">Location</Label>
            <Input id="location" defaultValue="Using your current location" disabled className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">Submit Report</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
