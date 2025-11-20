import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Lightbulb, MapPin, Layers, X } from "lucide-react";
import type { Layer as LayerType, Building, SimulationResult, RegenerativeProposal } from "@shared/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showLayers, setShowLayers] = useState<Record<string, boolean>>({
    buildings: true,
    sensors: true,
  });

  const { data: cities } = useQuery<any[]>({
    queryKey: ["/api/cities"],
  });

  const cityId = cities?.[0]?.id || "bengaluru-1";

  const { data: layers } = useQuery<LayerType[]>({
    queryKey: ["/api/cities", cityId, "layers"],
    enabled: !!cityId,
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/cities", cityId, "buildings"],
    enabled: !!cityId,
  });

  const { data: sensors } = useQuery<any[]>({
    queryKey: ["/api/cities", cityId, "sensors"],
    enabled: !!cityId,
  });

  const simulateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/simulate", { cityId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities", cityId, "simulations"] });
    },
  });

  const proposalMutation = useMutation({
    mutationFn: async (buildingId: string) => {
      const res = await apiRequest("POST", "/api/propose", { buildingId, cityId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities", cityId, "proposals"] });
      if (selectedBuilding) {
        queryClient.invalidateQueries({ queryKey: ["/api/buildings", selectedBuilding.id, "proposals"] });
      }
    },
  });

  const { data: buildingProposals } = useQuery<RegenerativeProposal[]>({
    queryKey: ["/api/buildings", selectedBuilding?.id, "proposals"],
    enabled: !!selectedBuilding,
  });

  const buildingsLayer = layers?.find(l => l.type === "buildings");
  const sensorsLayer = layers?.find(l => l.type === "sensors");

  const onEachBuilding = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const building = buildings?.find(b => b.id === feature.properties.id);
        if (building) {
          setSelectedBuilding(building);
        }
      },
    });
  };

  const buildingStyle = (feature: any) => {
    const energyRating = feature.properties.energyRating;
    const colors: Record<string, string> = {
      "A+": "#10b981",
      "A": "#34d399",
      "B": "#fbbf24",
      "C": "#f97316",
      "D": "#ef4444",
    };
    return {
      fillColor: colors[energyRating] || "#94a3b8",
      weight: 2,
      opacity: 1,
      color: "#1e293b",
      fillOpacity: 0.6,
    };
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1 relative">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          data-testid="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {showLayers.buildings && buildingsLayer && (
            <GeoJSON
              data={buildingsLayer.geoJSON}
              style={buildingStyle}
              onEachFeature={onEachBuilding}
            />
          )}
          
          {showLayers.sensors && sensors?.map(sensor => (
            <Marker key={sensor.id} position={[sensor.lat, sensor.lon]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{sensor.type.toUpperCase()} Sensor</p>
                  {sensor.readings?.length > 0 && (
                    <p>Latest: {sensor.readings[sensor.readings.length - 1].value} {sensor.readings[sensor.readings.length - 1].unit}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <Card className="absolute top-4 right-4 w-64 z-[1000]" data-testid="card-layer-controls">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Layer Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLayers.buildings}
                onChange={(e) => setShowLayers({ ...showLayers, buildings: e.target.checked })}
                data-testid="checkbox-layer-buildings"
              />
              <span className="text-sm">Buildings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLayers.sensors}
                onChange={(e) => setShowLayers({ ...showLayers, sensors: e.target.checked })}
                data-testid="checkbox-layer-sensors"
              />
              <span className="text-sm">Sensors</span>
            </label>
          </CardContent>
        </Card>

        <div className="absolute bottom-4 right-4 flex gap-2 z-[1000]">
          <Button
            onClick={() => simulateMutation.mutate()}
            disabled={simulateMutation.isPending}
            data-testid="button-run-simulation"
          >
            <Play className="w-4 h-4 mr-2" />
            {simulateMutation.isPending ? "Running..." : "Run Simulation"}
          </Button>
        </div>
      </div>

      {selectedBuilding && (
        <div className="w-96 border-l bg-card overflow-y-auto" data-testid="panel-building-details">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-building-name">{selectedBuilding.name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{selectedBuilding.type}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedBuilding(null)}
                data-testid="button-close-panel"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="text-lg font-semibold" data-testid="text-building-area">{selectedBuilding.area.toLocaleString()} m²</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floors</p>
                <p className="text-lg font-semibold" data-testid="text-building-floors">{selectedBuilding.floors}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Energy Rating</p>
                <Badge variant={selectedBuilding.properties.energyRating === "A+" ? "default" : "secondary"} data-testid="badge-energy-rating">
                  {selectedBuilding.properties.energyRating || "Not rated"}
                </Badge>
              </div>
              {selectedBuilding.properties.yearBuilt && (
                <div>
                  <p className="text-sm text-muted-foreground">Year Built</p>
                  <p className="text-lg font-semibold">{selectedBuilding.properties.yearBuilt}</p>
                </div>
              )}
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={() => proposalMutation.mutate(selectedBuilding.id)}
              disabled={proposalMutation.isPending}
              data-testid="button-generate-proposal"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {proposalMutation.isPending ? "Generating..." : "Generate Proposal"}
            </Button>

            {buildingProposals && buildingProposals.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">Regenerative Proposals</h3>
                  {buildingProposals.map((proposal) => (
                    <Card key={proposal.id} data-testid={`card-proposal-${proposal.id}`}>
                      <CardHeader>
                        <CardTitle className="text-sm">Investment Overview</CardTitle>
                        <CardDescription>
                          Total: ${proposal.totalInvestment.toLocaleString()} | Payback: {proposal.paybackPeriod} years
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {proposal.interventions.map((intervention, idx) => (
                          <div key={idx} className="space-y-1">
                            <p className="font-medium text-sm">{intervention.name}</p>
                            <p className="text-xs text-muted-foreground">{intervention.description}</p>
                            <div className="flex gap-2 flex-wrap">
                              {intervention.energyReduction && (
                                <Badge variant="outline" className="text-xs">-{intervention.energyReduction} kWh</Badge>
                              )}
                              {intervention.waterSavings && (
                                <Badge variant="outline" className="text-xs">+{intervention.waterSavings}L water</Badge>
                              )}
                              {intervention.temperatureDrop && (
                                <Badge variant="outline" className="text-xs">-{intervention.temperatureDrop}°C</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
