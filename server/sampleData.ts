import type { City, Layer, Building, Sensor, GeoJSONFeatureCollection } from "@shared/schema";

export const bengaluruCity: City = {
  id: "bengaluru-1",
  name: "Bengaluru",
  country: "India",
  centerLat: 12.9716,
  centerLon: 77.5946,
  climateFactor: 1.2,
};

export const bengaluruBuildings: Building[] = [
  {
    id: "building-1",
    cityId: "bengaluru-1",
    name: "Tech Park Alpha",
    type: "commercial",
    area: 5000,
    floors: 8,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.5940, 12.9720],
        [77.5945, 12.9720],
        [77.5945, 12.9715],
        [77.5940, 12.9715],
        [77.5940, 12.9720]
      ]]
    },
    properties: {
      usageIntensity: 0.8,
      energyRating: "B",
      yearBuilt: 2015,
    }
  },
  {
    id: "building-2",
    cityId: "bengaluru-1",
    name: "Residential Complex Beta",
    type: "residential",
    area: 3500,
    floors: 12,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.5950, 12.9725],
        [77.5955, 12.9725],
        [77.5955, 12.9720],
        [77.5950, 12.9720],
        [77.5950, 12.9725]
      ]]
    },
    properties: {
      usageIntensity: 0.6,
      energyRating: "C",
      yearBuilt: 2018,
    }
  },
  {
    id: "building-3",
    cityId: "bengaluru-1",
    name: "Shopping Mall Gamma",
    type: "commercial",
    area: 8000,
    floors: 4,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.5935, 12.9710],
        [77.5942, 12.9710],
        [77.5942, 12.9705],
        [77.5935, 12.9705],
        [77.5935, 12.9710]
      ]]
    },
    properties: {
      usageIntensity: 0.9,
      energyRating: "A",
      yearBuilt: 2020,
    }
  },
  {
    id: "building-4",
    cityId: "bengaluru-1",
    name: "Green Tower Delta",
    type: "mixed",
    area: 4500,
    floors: 15,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.5948, 12.9712],
        [77.5953, 12.9712],
        [77.5953, 12.9708],
        [77.5948, 12.9708],
        [77.5948, 12.9712]
      ]]
    },
    properties: {
      usageIntensity: 0.7,
      energyRating: "A+",
      yearBuilt: 2022,
      hasSolarPanels: true,
      hasRainwaterHarvesting: true,
    }
  },
  {
    id: "building-5",
    cityId: "bengaluru-1",
    name: "Office Hub Epsilon",
    type: "commercial",
    area: 6000,
    floors: 10,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.5960, 12.9718],
        [77.5966, 12.9718],
        [77.5966, 12.9713],
        [77.5960, 12.9713],
        [77.5960, 12.9718]
      ]]
    },
    properties: {
      usageIntensity: 0.85,
      energyRating: "B",
      yearBuilt: 2017,
    }
  },
];

const buildingGeoJSON: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: bengaluruBuildings.map(building => ({
    type: "Feature" as const,
    geometry: building.geometry,
    properties: {
      id: building.id,
      name: building.name,
      type: building.type,
      area: building.area,
      floors: building.floors,
      ...building.properties,
    }
  }))
};

export const bengaluruBuildingsLayer: Layer = {
  id: "layer-buildings-1",
  cityId: "bengaluru-1",
  name: "Buildings",
  type: "buildings",
  geoJSON: buildingGeoJSON,
};

export const bengaluruSensors: Sensor[] = [
  {
    id: "sensor-1",
    cityId: "bengaluru-1",
    buildingId: "building-1",
    type: "energy",
    lat: 12.9717,
    lon: 77.5942,
    readings: [
      { timestamp: "2025-01-15T08:00:00Z", value: 450, unit: "kWh" },
      { timestamp: "2025-01-15T09:00:00Z", value: 480, unit: "kWh" },
      { timestamp: "2025-01-15T10:00:00Z", value: 520, unit: "kWh" },
      { timestamp: "2025-01-15T11:00:00Z", value: 550, unit: "kWh" },
      { timestamp: "2025-01-15T12:00:00Z", value: 580, unit: "kWh" },
    ]
  },
  {
    id: "sensor-2",
    cityId: "bengaluru-1",
    buildingId: "building-2",
    type: "water",
    lat: 12.9722,
    lon: 77.5952,
    readings: [
      { timestamp: "2025-01-15T08:00:00Z", value: 1200, unit: "liters" },
      { timestamp: "2025-01-15T09:00:00Z", value: 1350, unit: "liters" },
      { timestamp: "2025-01-15T10:00:00Z", value: 1400, unit: "liters" },
      { timestamp: "2025-01-15T11:00:00Z", value: 1500, unit: "liters" },
      { timestamp: "2025-01-15T12:00:00Z", value: 1600, unit: "liters" },
    ]
  },
  {
    id: "sensor-3",
    cityId: "bengaluru-1",
    buildingId: "building-3",
    type: "energy",
    lat: 12.9707,
    lon: 77.5938,
    readings: [
      { timestamp: "2025-01-15T08:00:00Z", value: 720, unit: "kWh" },
      { timestamp: "2025-01-15T09:00:00Z", value: 780, unit: "kWh" },
      { timestamp: "2025-01-15T10:00:00Z", value: 850, unit: "kWh" },
      { timestamp: "2025-01-15T11:00:00Z", value: 900, unit: "kWh" },
      { timestamp: "2025-01-15T12:00:00Z", value: 920, unit: "kWh" },
    ]
  },
  {
    id: "sensor-4",
    cityId: "bengaluru-1",
    buildingId: "building-4",
    type: "temperature",
    lat: 12.9710,
    lon: 77.5950,
    readings: [
      { timestamp: "2025-01-15T08:00:00Z", value: 24.5, unit: "°C" },
      { timestamp: "2025-01-15T09:00:00Z", value: 25.2, unit: "°C" },
      { timestamp: "2025-01-15T10:00:00Z", value: 26.8, unit: "°C" },
      { timestamp: "2025-01-15T11:00:00Z", value: 28.1, unit: "°C" },
      { timestamp: "2025-01-15T12:00:00Z", value: 29.3, unit: "°C" },
    ]
  },
  {
    id: "sensor-5",
    cityId: "bengaluru-1",
    buildingId: "building-5",
    type: "energy",
    lat: 12.9715,
    lon: 77.5963,
    readings: [
      { timestamp: "2025-01-15T08:00:00Z", value: 540, unit: "kWh" },
      { timestamp: "2025-01-15T09:00:00Z", value: 590, unit: "kWh" },
      { timestamp: "2025-01-15T10:00:00Z", value: 630, unit: "kWh" },
      { timestamp: "2025-01-15T11:00:00Z", value: 670, unit: "kWh" },
      { timestamp: "2025-01-15T12:00:00Z", value: 700, unit: "kWh" },
    ]
  },
];

const sensorGeoJSON: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: bengaluruSensors.map(sensor => ({
    type: "Feature" as const,
    geometry: {
      type: "Point",
      coordinates: [sensor.lon, sensor.lat]
    },
    properties: {
      id: sensor.id,
      type: sensor.type,
      buildingId: sensor.buildingId,
      latestReading: sensor.readings[sensor.readings.length - 1],
    }
  }))
};

export const bengaluruSensorsLayer: Layer = {
  id: "layer-sensors-1",
  cityId: "bengaluru-1",
  name: "Sensors",
  type: "sensors",
  geoJSON: sensorGeoJSON,
};
