import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-2xl">
        <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search for posts, tags, or communities..."
            className="w-full rounded-lg bg-card pl-10 h-12 text-lg"
            />
        </div>
      <Card className="min-h-[400px]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">
              Search results will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
