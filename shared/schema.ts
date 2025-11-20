import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  centerLat: number;
  centerLon: number;
  climateFactor: number;
}

export interface Layer {
  id: string;
  cityId: string;
  name: string;
  type: "buildings" | "sensors" | "energy" | "water";
  geoJSON: GeoJSONFeatureCollection;
}

export interface Building {
  id: string;
  cityId: string;
  name: string;
  type: string;
  area: number;
  floors: number;
  geometry: GeoJSONFeature["geometry"];
  properties: {
    usageIntensity: number;
    energyRating?: string;
    [key: string]: any;
  };
}

export interface Sensor {
  id: string;
  cityId: string;
  buildingId?: string;
  type: "energy" | "water" | "temperature" | "air_quality";
  lat: number;
  lon: number;
  readings: {
    timestamp: string;
    value: number;
    unit: string;
  }[];
}

export interface SimulationResult {
  id: string;
  cityId: string;
  timestamp: string;
  buildingResults: {
    buildingId: string;
    energyDemand: number;
    waterDemand: number;
    materialFlow: number;
    stressLevel: number;
  }[];
  totalEnergy: number;
  totalWater: number;
  totalMaterials: number;
  averageStress: number;
}

export interface RegenerativeProposal {
  id: string;
  buildingId: string;
  cityId: string;
  timestamp: string;
  interventions: {
    type: "green_roof" | "rainwater_harvesting" | "passive_cooling" | "solar_panels";
    name: string;
    description: string;
    energyReduction?: number;
    waterSavings?: number;
    temperatureDrop?: number;
    costEstimate: number;
    roi: number;
    implementationTime: string;
  }[];
  totalInvestment: number;
  totalSavings: number;
  paybackPeriod: number;
}

export const citySchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  centerLat: z.number().min(-90).max(90),
  centerLon: z.number().min(-180).max(180),
  climateFactor: z.number().min(0).max(2).default(1),
});

export type InsertCity = z.infer<typeof citySchema>;

export const layerSchema = z.object({
  cityId: z.string(),
  name: z.string().min(1),
  type: z.enum(["buildings", "sensors", "energy", "water"]),
  geoJSON: z.any(),
});

export type InsertLayer = z.infer<typeof layerSchema>;

export const sensorReadingSchema = z.object({
  cityId: z.string(),
  buildingId: z.string().optional(),
  type: z.enum(["energy", "water", "temperature", "air_quality"]),
  lat: z.number(),
  lon: z.number(),
  value: z.number(),
  unit: z.string(),
});

export type InsertSensorReading = z.infer<typeof sensorReadingSchema>;
