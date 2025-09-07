
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { WasteReport, WasteType } from '@/lib/types';
import { mockReports } from '@/lib/mock-data';
import { subHours } from 'date-fns';

interface AddReportData {
    userId: string;
    description: string;
    photoUrl: string;
    wasteType: WasteType;
    location: { lat: number; lng: number };
    aiSuggestion?: string;
}

interface WasteReportsContextType {
  reports: WasteReport[];
  addReport: (report: AddReportData) => void;
  updateReportStatus: (reportId: string, status: WasteReport['status']) => void;
}

const WasteReportsContext = createContext<WasteReportsContextType | undefined>(undefined);

export function WasteReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<WasteReport[]>(mockReports);

  const addReport = (report: AddReportData) => {
    const newReport: WasteReport = {
      ...report,
      id: `r${Date.now()}`,
      status: 'open',
      timestamp: new Date(),
    };
    setReports(prevReports => [newReport, ...prevReports]);
  };

  const updateReportStatus = (reportId: string, status: WasteReport['status']) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status } : report
      )
    );
  };
  
  const activeReports = useMemo(() => {
    const twentyFourHoursAgo = subHours(new Date(), 24);
    return reports.filter(report => new Date(report.timestamp) > twentyFourHoursAgo);
  }, [reports]);


  return (
    <WasteReportsContext.Provider value={{ reports: activeReports, addReport, updateReportStatus }}>
      {children}
    </WasteReportsContext.Provider>
  );
}

export function useWasteReports() {
  const context = useContext(WasteReportsContext);
  if (context === undefined) {
    throw new Error('useWasteReports must be used within a WasteReportsProvider');
  }
  return context;
}
