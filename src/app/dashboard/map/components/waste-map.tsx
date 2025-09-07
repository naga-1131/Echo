"use client";

import { useState } from "react";
import { Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { mockReports } from "@/lib/mock-data";
import ReportWasteForm from "./report-waste-form";
import ReportInfoWindow from "./report-info-window";
import type { WasteReport } from "@/lib/types";
import { Plus } from "lucide-react";

export default function WasteMap() {
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border">
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId="a3b0c4d0e8f0a9b"
      >
        {mockReports.map((report) => (
          <AdvancedMarker
            key={report.id}
            position={report.location}
            onClick={() => setSelectedReport(report)}
          />
        ))}
        {selectedReport && (
          <InfoWindow
            position={selectedReport.location}
            onCloseClick={() => setSelectedReport(null)}
          >
            <ReportInfoWindow report={selectedReport} />
          </InfoWindow>
        )}
      </Map>
      <div className="absolute bottom-4 right-4">
        <Button onClick={() => setIsFormOpen(true)} className="rounded-full h-14 w-14 shadow-lg">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Report Waste</span>
        </Button>
      </div>
      <ReportWasteForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
