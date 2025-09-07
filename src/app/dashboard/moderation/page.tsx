
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentModerationTool from "./components/content-moderation-tool";
import WasteReportManagement from "./components/waste-report-management";

export default function ModerationPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-6">Moderation Tools</h1>
      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="content">Content Moderation</TabsTrigger>
          <TabsTrigger value="reports">Waste Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentModerationTool />
        </TabsContent>
        <TabsContent value="reports">
          <WasteReportManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
