
"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import WasteMap from "./components/waste-map";
import { API_KEY } from "@/lib/google-maps-api-key";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function MapPage() {
  if (!API_KEY || API_KEY === "AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYY_XXXX" || API_KEY.length < 30) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Google Maps API Key Missing or Invalid</AlertTitle>
          <AlertDescription>
            <p>The Google Maps feature cannot be displayed because the API key is not configured correctly. The current key is a non-functional placeholder.</p>
            <p className="mt-2">
              Please get a valid Google Maps API key from the Google Cloud Console and add it to the file at:
              <code className="ml-1 bg-muted px-1 py-0.5 rounded">src/lib/google-maps-api-key.ts</code>.
            </p>
             <p className="mt-4">
              You can get a key by visiting the <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Cloud Console</a>.
            </p>
             <p className="mt-2 font-semibold">Is your key already there?</p>
            <p className="mt-1">
              If you have already added a real key, this error usually means you need to enable billing for your Google Cloud project. Google requires a credit card on file even for the free tier.
            </p>
             <p className="mt-2">
              Please visit the <a href="https://console.cloud.google.com/project/_/billing/enable" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Cloud Console billing page</a> to enable it.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] w-full">
      <APIProvider apiKey={API_KEY}>
        <WasteMap />
      </APIProvider>
    </div>
  );
}
