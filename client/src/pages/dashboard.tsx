import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, Droplet, Package, ThermometerSun } from "lucide-react";
import type { SimulationResult, Sensor } from "@shared/schema";

export default function Dashboard() {
  const { data: cities } = useQuery<any[]>({
    queryKey: ["/api/cities"],
  });
  const { data: selectedCity } = useQuery<{ cityId: string } | null>({
    queryKey: ["/api/selected-city"],
  });

  const cityId = selectedCity?.cityId || cities?.[0]?.id || "bengaluru-1";

  const { data: simulations } = useQuery<SimulationResult[]>({
    queryKey: ["/api/cities", cityId, "simulations"],
    enabled: !!cityId,
  });

  const { data: sensors } = useQuery<Sensor[]>({
    queryKey: ["/api/cities", cityId, "sensors"],
    enabled: !!cityId,
  });

  const latestSimulation = simulations?.[simulations.length - 1];

  const energySensors = sensors?.filter(s => s.type === "energy") || [];
  const waterSensors = sensors?.filter(s => s.type === "water") || [];
  const temperatureSensors = sensors?.filter(s => s.type === "temperature") || [];

  const energyTimeSeriesData = energySensors[0]?.readings.map(r => ({
    timestamp: new Date(r.timestamp).toLocaleTimeString(),
    value: r.value,
  })) || [];

  const waterTimeSeriesData = waterSensors[0]?.readings.map(r => ({
    timestamp: new Date(r.timestamp).toLocaleTimeString(),
    value: r.value,
  })) || [];

  const buildingComparisonData = latestSimulation?.buildingResults.slice(0, 5).map((b, idx) => ({
    name: `Building ${idx + 1}`,
    energy: b.energyDemand,
    water: b.waterDemand,
    stress: b.stressLevel * 100,
  })) || [];

  const metrics = [
    {
      title: "Total Energy",
      value: latestSimulation?.totalEnergy ? `${latestSimulation.totalEnergy.toFixed(0)} kWh` : "N/A",
      icon: Activity,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Total Water",
      value: latestSimulation?.totalWater ? `${latestSimulation.totalWater.toFixed(0)} L` : "N/A",
      icon: Droplet,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Materials Flow",
      value: latestSimulation?.totalMaterials ? `${latestSimulation.totalMaterials.toFixed(0)} kg` : "N/A",
      icon: Package,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Avg. Stress Level",
      value: latestSimulation?.averageStress ? `${(latestSimulation.averageStress * 100).toFixed(0)}%` : "N/A",
      icon: ThermometerSun,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">City Analytics Dashboard</h1>
          <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
            Real-time insights and metrics for {cities?.[0]?.name || "your city"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <Card key={idx} data-testid={`card-metric-${idx}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`w-10 h-10 rounded-md ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-metric-value-${idx}`}>{metric.value}</div>
                {latestSimulation && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(latestSimulation.timestamp).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="energy" className="space-y-6">
          <TabsList>
            <TabsTrigger value="energy" data-testid="tab-energy">Energy</TabsTrigger>
            <TabsTrigger value="water" data-testid="tab-water">Water</TabsTrigger>
            <TabsTrigger value="comparison" data-testid="tab-comparison">Building Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="energy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption Trends</CardTitle>
                <CardDescription>Hourly energy usage patterns across monitored buildings</CardDescription>
              </CardHeader>
              <CardContent>
                {energyTimeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={energyTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" name="Energy (kWh)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No energy data available. Run a simulation to generate metrics.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Water Consumption Trends</CardTitle>
                <CardDescription>Hourly water usage patterns across monitored buildings</CardDescription>
              </CardHeader>
              <CardContent>
                {waterTimeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={waterTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" name="Water (L)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No water data available. Run a simulation to generate metrics.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Building-by-Building Comparison</CardTitle>
                <CardDescription>Resource consumption and stress levels across buildings</CardDescription>
              </CardHeader>
              <CardContent>
                {buildingComparisonData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={buildingComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="energy" fill="hsl(var(--chart-1))" name="Energy (kWh)" />
                      <Bar dataKey="water" fill="hsl(var(--chart-2))" name="Water (L)" />
                      <Bar dataKey="stress" fill="hsl(var(--chart-5))" name="Stress (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No simulation data available. Run a simulation to generate metrics.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
