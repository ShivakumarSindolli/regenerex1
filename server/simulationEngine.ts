import type { Building, City, SimulationResult } from "@shared/schema";

export function runSimulation(
  city: City,
  buildings: Building[]
): Omit<SimulationResult, "id"> {
  const timestamp = new Date().toISOString();
  
  const buildingResults = buildings.map(building => {
    const baseEnergy = building.area * building.properties.usageIntensity * 0.15;
    const energyDemand = baseEnergy * city.climateFactor;
    
    const baseWater = building.area * building.properties.usageIntensity * 0.08;
    const waterDemand = baseWater * city.climateFactor;
    
    const materialFlow = building.area * building.floors * 0.02;
    
    const energyRatingMultiplier = getEnergyRatingMultiplier(building.properties.energyRating);
    const adjustedEnergy = energyDemand * energyRatingMultiplier;
    
    const stressLevel = calculateStressLevel(
      adjustedEnergy,
      waterDemand,
      building.area,
      building.properties.usageIntensity
    );
    
    return {
      buildingId: building.id,
      energyDemand: Math.round(adjustedEnergy * 100) / 100,
      waterDemand: Math.round(waterDemand * 100) / 100,
      materialFlow: Math.round(materialFlow * 100) / 100,
      stressLevel: Math.round(stressLevel * 100) / 100,
    };
  });
  
  const totalEnergy = buildingResults.reduce((sum, b) => sum + b.energyDemand, 0);
  const totalWater = buildingResults.reduce((sum, b) => sum + b.waterDemand, 0);
  const totalMaterials = buildingResults.reduce((sum, b) => sum + b.materialFlow, 0);
  const averageStress = buildingResults.reduce((sum, b) => sum + b.stressLevel, 0) / buildingResults.length;
  
  return {
    cityId: city.id,
    timestamp,
    buildingResults,
    totalEnergy: Math.round(totalEnergy * 100) / 100,
    totalWater: Math.round(totalWater * 100) / 100,
    totalMaterials: Math.round(totalMaterials * 100) / 100,
    averageStress: Math.round(averageStress * 100) / 100,
  };
}

function getEnergyRatingMultiplier(rating: string | undefined): number {
  const ratings: Record<string, number> = {
    "A+": 0.7,
    "A": 0.8,
    "B": 0.9,
    "C": 1.0,
    "D": 1.15,
    "E": 1.3,
  };
  return ratings[rating || "C"] || 1.0;
}

function calculateStressLevel(
  energy: number,
  water: number,
  area: number,
  intensity: number
): number {
  const energyPerArea = energy / area;
  const waterPerArea = water / area;
  
  const energyStress = Math.min(energyPerArea / 0.2, 1);
  const waterStress = Math.min(waterPerArea / 0.1, 1);
  const intensityStress = intensity;
  
  return (energyStress * 0.4 + waterStress * 0.3 + intensityStress * 0.3);
}

export function forecastTimeSeries(
  historicalValues: number[],
  periods: number,
  alpha: number = 0.3
): number[] {
  if (historicalValues.length === 0) return [];
  
  const forecast: number[] = [...historicalValues];
  let level = historicalValues[0];
  
  for (let i = 1; i < historicalValues.length; i++) {
    level = alpha * historicalValues[i] + (1 - alpha) * level;
  }
  
  for (let i = 0; i < periods; i++) {
    forecast.push(level);
  }
  
  return forecast.slice(historicalValues.length);
}
