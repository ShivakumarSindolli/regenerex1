import type { Building, RegenerativeProposal } from "@shared/schema";

export function generateProposal(
  building: Building,
  cityId: string
): Omit<RegenerativeProposal, "id"> {
  const timestamp = new Date().toISOString();
  const interventions: RegenerativeProposal["interventions"] = [];
  
  const hasGreenRoof = building.properties.hasGreenRoof;
  const hasRainwater = building.properties.hasRainwaterHarvesting;
  const hasSolar = building.properties.hasSolarPanels;
  const hasPassiveCooling = building.properties.hasPassiveCooling;
  
  if (!hasGreenRoof) {
    const greenRoofArea = building.area / building.floors;
    const energyReduction = greenRoofArea * 0.12;
    const temperatureDrop = 2.5;
    const cost = greenRoofArea * 85;
    const annualSavings = energyReduction * 0.15 * 365;
    
    interventions.push({
      type: "green_roof",
      name: "Green Roof Installation",
      description: `Install vegetation layer on ${Math.round(greenRoofArea)}m² rooftop. Reduces heat absorption, provides insulation, and manages stormwater runoff.`,
      energyReduction: Math.round(energyReduction * 100) / 100,
      temperatureDrop: Math.round(temperatureDrop * 10) / 10,
      costEstimate: Math.round(cost),
      roi: Math.round((annualSavings / cost) * 100),
      implementationTime: "3-4 months",
    });
  }
  
  if (!hasRainwater) {
    const capacity = building.area * 0.8;
    const waterSavings = capacity * 0.6;
    const cost = capacity * 45;
    const annualSavings = waterSavings * 0.003 * 365;
    
    interventions.push({
      type: "rainwater_harvesting",
      name: "Rainwater Harvesting System",
      description: `Install ${Math.round(capacity)}L rainwater collection and storage system. Captures rooftop runoff for non-potable uses.`,
      waterSavings: Math.round(waterSavings),
      costEstimate: Math.round(cost),
      roi: Math.round((annualSavings / cost) * 100),
      implementationTime: "2-3 months",
    });
  }
  
  if (!hasPassiveCooling && building.type !== "residential") {
    const facadeArea = building.floors * Math.sqrt(building.area) * 4 * 3;
    const temperatureDrop = 3.2;
    const energyReduction = facadeArea * 0.08;
    const cost = facadeArea * 120;
    const annualSavings = energyReduction * 0.15 * 365;
    
    interventions.push({
      type: "passive_cooling",
      name: "Passive Cooling Facade",
      description: `Retrofit ${Math.round(facadeArea)}m² facade with thermal mass materials, shading devices, and ventilation optimization.`,
      energyReduction: Math.round(energyReduction * 100) / 100,
      temperatureDrop: Math.round(temperatureDrop * 10) / 10,
      costEstimate: Math.round(cost),
      roi: Math.round((annualSavings / cost) * 100),
      implementationTime: "6-8 months",
    });
  }
  
  if (!hasSolar && building.floors <= 10) {
    const roofArea = building.area / building.floors;
    const solarCapacity = roofArea * 0.15;
    const energyReduction = solarCapacity * 1500;
    const cost = solarCapacity * 1200;
    const annualSavings = energyReduction * 0.15;
    
    interventions.push({
      type: "solar_panels",
      name: "Rooftop Solar Installation",
      description: `Install ${Math.round(solarCapacity)}kW solar photovoltaic system on rooftop. Generates clean energy and reduces grid dependency.`,
      energyReduction: Math.round(energyReduction),
      costEstimate: Math.round(cost),
      roi: Math.round((annualSavings / cost) * 100),
      implementationTime: "2-3 months",
    });
  }
  
  const totalInvestment = interventions.reduce((sum, i) => sum + i.costEstimate, 0);
  const totalAnnualSavings = interventions.reduce((sum, i) => {
    const energySavings = (i.energyReduction || 0) * 0.15 * 365;
    const waterSavingsValue = (i.waterSavings || 0) * 0.003 * 365;
    return sum + energySavings + waterSavingsValue;
  }, 0);
  const paybackPeriod = totalInvestment / totalAnnualSavings;
  
  return {
    buildingId: building.id,
    cityId,
    timestamp,
    interventions,
    totalInvestment: Math.round(totalInvestment),
    totalSavings: Math.round(totalAnnualSavings),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  };
}
