import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunitiesPage() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Communities</CardTitle>
          <CardDescription>
            Discover, join, and create communities to collaborate on environmental action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Community features coming soon!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
