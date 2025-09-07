
"use client";

import { APIProvider, ControlPosition } from "@vis.gl/react-google-maps";
import WasteMap from "./components/waste-map";
import { API_KEY } from "@/lib/google-maps-api-key";
import { WasteReportsProvider } from "./components/waste-reports-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function MapPage() {
  if (!API_KEY || API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Google Maps API Key Missing</AlertTitle>
          <AlertDescription>
            <p>The Google Maps feature cannot be displayed. It seems the API key is missing or invalid.</p>
            <p className="mt-2">Please add your Google Maps API key to the file at <code className="bg-muted px-1 py-0.5 rounded">src/lib/google-maps-api-key.ts</code>.</p>
            <p className="mt-2">If you have already added a key, please ensure that you have enabled the Maps JavaScript API and enabled billing for your Google Cloud project.</p>
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
