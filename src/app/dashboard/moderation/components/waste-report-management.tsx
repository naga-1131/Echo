
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { WasteReport } from '@/lib/types';
import { useWasteReports } from '../../map/components/waste-reports-provider';

export default function WasteReportManagement() {
    const { reports, updateReportStatus } = useWasteReports();

    const handleStatusChange = (reportId: string, status: WasteReport['status']) => {
        updateReportStatus(reportId, status);
    };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Report Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reported On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Image
                    src={report.photoUrl}
                    alt={report.description}
                    width={80}
                    height={60}
                    className="rounded-md object-cover"
                    data-ai-hint="waste trash"
                  />
                </TableCell>
                <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                <TableCell>{format(new Date(report.timestamp), "PPP")}</TableCell>
                <TableCell>
                  <Badge
                     variant="default"
                     className={cn(
                       "capitalize text-white",
                       report.status === "open" && "bg-destructive hover:bg-destructive/80",
                       report.status === "in-progress" && "bg-yellow-500 hover:bg-yellow-500/80 text-black",
                       report.status === "closed" && "bg-primary hover:bg-primary/80"
                     )}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'open')}>
                        Mark as Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'in-progress')}>
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'closed')}>
                        Mark as Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
