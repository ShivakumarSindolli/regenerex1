import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileJson, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [layerType, setLayerType] = useState<string>("buildings");
  const [layerName, setLayerName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !layerName) {
        throw new Error("File and layer name required");
      }

      const fileContent = await selectedFile.text();
      let geoJSON;

      try {
        if (selectedFile.name.endsWith(".json") || selectedFile.name.endsWith(".geojson")) {
          geoJSON = JSON.parse(fileContent);
        } else if (selectedFile.name.endsWith(".csv")) {
          toast({
            title: "CSV parsing",
            description: "CSV to GeoJSON conversion would be implemented here",
          });
          return;
        } else {
          throw new Error("Unsupported file type");
        }
      } catch (error) {
        throw new Error("Failed to parse file");
      }

      const res = await apiRequest("POST", "/api/layers", {
        cityId: "bengaluru-1",
        name: layerName,
        type: layerType,
        geoJSON,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Layer has been added to the city",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      setSelectedFile(null);
      setLayerName("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload file",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-upload-title">Upload City Data</h1>
          <p className="text-muted-foreground" data-testid="text-upload-subtitle">
            Import GeoJSON or CSV files to add layers to your city
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Supported formats: GeoJSON (.json, .geojson), CSV (.csv)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              data-testid="dropzone"
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    {selectedFile.name.endsWith(".json") || selectedFile.name.endsWith(".geojson") ? (
                      <FileJson className="w-12 h-12 text-primary" />
                    ) : (
                      <FileSpreadsheet className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium" data-testid="text-selected-file">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    data-testid="button-remove-file"
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground">or</p>
                  </div>
                  <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()} data-testid="button-browse">
                    Browse Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept=".json,.geojson,.csv"
                    className="hidden"
                    onChange={handleFileSelect}
                    data-testid="input-file"
                  />
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="layer-name">Layer Name</Label>
                  <Input
                    id="layer-name"
                    placeholder="e.g., Downtown Buildings"
                    value={layerName}
                    onChange={(e) => setLayerName(e.target.value)}
                    data-testid="input-layer-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layer-type">Layer Type</Label>
                  <Select value={layerType} onValueChange={setLayerType}>
                    <SelectTrigger id="layer-type" data-testid="select-layer-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buildings" data-testid="option-buildings">Buildings</SelectItem>
                      <SelectItem value="sensors" data-testid="option-sensors">Sensors</SelectItem>
                      <SelectItem value="energy" data-testid="option-energy">Energy Grid</SelectItem>
                      <SelectItem value="water" data-testid="option-water">Water Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={() => uploadMutation.mutate()}
                  disabled={uploadMutation.isPending || !layerName}
                  data-testid="button-upload"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload Layer"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supported File Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Badge variant="outline">GeoJSON</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">GeoJSON Files (.json, .geojson)</p>
                <p className="text-sm text-muted-foreground">
                  Building footprints, sensor locations, infrastructure networks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Badge variant="outline">CSV</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">CSV Files (.csv)</p>
                <p className="text-sm text-muted-foreground">
                  Sensor readings, time-series data, building properties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
