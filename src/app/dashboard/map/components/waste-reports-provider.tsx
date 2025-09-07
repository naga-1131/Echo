
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { WasteReport } from '@/lib/types';
import { mockReports } from '@/lib/mock-data';

interface WasteReportsContextType {
  reports: WasteReport[];
  addReport: (report: Omit<WasteReport, 'id' | 'status' | 'timestamp'>) => void;
  updateReportStatus: (reportId: string, status: WasteReport['status']) => void;
}

const WasteReportsContext = createContext<WasteReportsContextType | undefined>(undefined);

export function WasteReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<WasteReport[]>(mockReports);

  const addReport = (report: Omit<WasteReport, 'id' | 'status' | 'timestamp'>) => {
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

  return (
    <WasteReportsContext.Provider value={{ reports, addReport, updateReportStatus }}>
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
