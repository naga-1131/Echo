import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { WasteReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReportInfoWindowProps {
  report: WasteReport;
}

const statusColors = {
  open: "bg-red-500",
  "in-progress": "bg-yellow-500",
  closed: "bg-green-500",
};

export default function ReportInfoWindow({ report }: ReportInfoWindowProps) {
  return (
    <div className="w-64 p-1">
      <div className="relative h-32 w-full mb-2 rounded-md overflow-hidden">
        <Image src={report.photoUrl} alt={report.description} layout="fill" objectFit="cover" data-ai-hint="waste trash" />
      </div>
      <h3 className="font-semibold text-sm mb-1">{report.description}</h3>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <p>{formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}</p>
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
      </div>
    </div>
  );
}
