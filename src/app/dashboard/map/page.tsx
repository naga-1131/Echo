"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import WasteMap from "./components/waste-map";
import { API_KEY } from "@/lib/google-maps-api-key";

export default function MapPage() {
  if (!API_KEY || API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Google Maps API Key Missing</h2>
          <p className="text-muted-foreground">
            Please add your Google Maps API key to{" "}
            <code className="bg-muted px-1 py-0.5 rounded">src/lib/google-maps-api-key.ts</code> to enable map
            functionality.
          </p>
        </div>
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
