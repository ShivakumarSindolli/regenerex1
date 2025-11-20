import MapPage from "./map";
import Dashboard from "./dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeaturePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Feature</h1>
          <p className="text-muted-foreground">Access the map and dashboard in one place.</p>
        </div>

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="h-[75vh] rounded-md overflow-hidden border">
              <MapPage />
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <div className="rounded-md overflow-hidden border bg-card">
              <Dashboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
