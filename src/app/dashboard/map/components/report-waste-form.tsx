
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePlus, X, Loader2, Bot } from "lucide-react";
import { useWasteReports } from "./waste-reports-provider";
import { useUser } from "../../components/user-provider";
import type { WasteType } from "@/lib/types";
import { analyzeWaste, type WasteAnalysisOutput } from "@/ai/flows/waste-analysis-flow";

interface ReportWasteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportWasteForm({ open, onOpenChange }: ReportWasteFormProps) {
  const { user } = useUser();
  const { addReport } = useWasteReports();
  const [description, setDescription] = useState("");
  const [wasteType, setWasteType] = useState<WasteType | "">("");
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisOutput | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationWatchId = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setIsLocating(true);
      setError("");

      if (navigator.geolocation) {
        locationWatchId.current = navigator.geolocation.watchPosition(
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
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setIsLocating(false);
      }
    } else {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }
    }

    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, [open]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnalysisResult(null);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setPhotoDataUri(dataUri);
        
        // Start AI analysis
        setIsAnalyzing(true);
        try {
          const result = await analyzeWaste({ photoDataUri: dataUri });
          setAnalysisResult(result);
        } catch (aiError) {
          console.error("AI analysis failed:", aiError);
          setError("AI analysis failed. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setDescription("");
    setWasteType("");
    setPhotoDataUri(null);
    setLocation(null);
    setError("");
    setAnalysisResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = () => {
    if (!description || !wasteType || !photoDataUri || !location || !user) {
        setError("Please fill all fields and ensure location is set.");
        return;
    };
    
    addReport({
        userId: user.id,
        description,
        wasteType,
        photoUrl: photoDataUri,
        location,
        aiSuggestion: analysisResult?.suggestion,
    });

    clearForm();
    onOpenChange(false);
  }
  
  const isSubmitDisabled = !description || !wasteType || !photoDataUri || !location || isLocating || isAnalyzing;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) clearForm();
    }}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Report a Waste Spot</SheetTitle>
          <SheetDescription>
            Help keep our community clean. Fill out the details below to report a waste issue.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleImageChange} ref={fileInputRef} />
             {photoDataUri ? (
              <div className="relative group">
                <Image src={photoDataUri} alt="Selected preview" width={400} height={225} className="rounded-md object-cover w-full aspect-video" data-ai-hint="waste trash" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => setPhotoDataUri(null)}>
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
          
          {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin"/>
                  <span>Analyzing waste with AI...</span>
              </div>
          )}

          {analysisResult && (
              <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>Eco-AI Suggestion</AlertTitle>
                  <AlertDescription>
                    <p><span className="font-semibold">Identified Type:</span> {analysisResult.wasteType}</p>
                    <p><span className="font-semibold">Recommendation:</span> {analysisResult.suggestion}</p>
                  </AlertDescription>
              </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="waste-type">Waste Type Tag</Label>
             <Select value={wasteType} onValueChange={(value) => setWasteType(value as WasteType)}>
              <SelectTrigger id="waste-type">
                <SelectValue placeholder="Select a waste type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overflowing-bin">Overflowing Bin</SelectItem>
                <SelectItem value="plastic-dump">Plastic Dump</SelectItem>
                <SelectItem value="e-waste">E-Waste</SelectItem>
                <SelectItem value="litter">General Litter</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Old television left on the curb, plastic bottles near the river..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="location">Live Location</Label>
            <div className="flex items-center gap-2 h-10 px-3 py-2 text-sm rounded-md border border-input bg-muted">
                {isLocating ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Acquiring highest accuracy...</span>
                    </>
                ) : location ? (
                    <span>{`Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`}</span>
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
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
