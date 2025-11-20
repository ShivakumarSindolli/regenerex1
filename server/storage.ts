import type { 
  User, InsertUser, City, InsertCity, Layer, InsertLayer, Building, Sensor, 
  SimulationResult, RegenerativeProposal, InsertSensorReading 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { 
  bengaluruCity, bengaluruBuildings, bengaluruBuildingsLayer, 
  bengaluruSensors, bengaluruSensorsLayer 
} from "./sampleData";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCities(): Promise<City[]>;
  getCity(id: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  getLayers(cityId: string): Promise<Layer[]>;
  getLayer(id: string): Promise<Layer | undefined>;
  createLayer(layer: InsertLayer): Promise<Layer>;
  
  getBuildings(cityId: string): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  
  getSensors(cityId: string): Promise<Sensor[]>;
  getSensor(id: string): Promise<Sensor | undefined>;
  addSensorReading(sensorId: string, reading: { timestamp: string; value: number; unit: string }): Promise<Sensor>;
  
  saveSimulation(simulation: Omit<SimulationResult, "id">): Promise<SimulationResult>;
  getSimulations(cityId: string): Promise<SimulationResult[]>;
  
  saveProposal(proposal: Omit<RegenerativeProposal, "id">): Promise<RegenerativeProposal>;
  getProposals(cityId: string): Promise<RegenerativeProposal[]>;
  getProposalsByBuilding(buildingId: string): Promise<RegenerativeProposal[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cities: Map<string, City>;
  private layers: Map<string, Layer>;
  private buildings: Map<string, Building>;
  private sensors: Map<string, Sensor>;
  private simulations: Map<string, SimulationResult>;
  private proposals: Map<string, RegenerativeProposal>;

  constructor() {
    this.users = new Map();
    this.cities = new Map();
    this.layers = new Map();
    this.buildings = new Map();
    this.sensors = new Map();
    this.simulations = new Map();
    this.proposals = new Map();
    
    this.cities.set(bengaluruCity.id, bengaluruCity);
    
    this.layers.set(bengaluruBuildingsLayer.id, bengaluruBuildingsLayer);
    this.layers.set(bengaluruSensorsLayer.id, bengaluruSensorsLayer);
    
    bengaluruBuildings.forEach(building => {
      this.buildings.set(building.id, building);
    });
    
    bengaluruSensors.forEach(sensor => {
      this.sensors.set(sensor.id, sensor);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }
  
  async getCity(id: string): Promise<City | undefined> {
    return this.cities.get(id);
  }
  
  async createCity(insertCity: InsertCity): Promise<City> {
    const id = randomUUID();
    const city: City = { ...insertCity, id };
    this.cities.set(id, city);
    return city;
  }
  
  async getLayers(cityId: string): Promise<Layer[]> {
    return Array.from(this.layers.values()).filter(
      layer => layer.cityId === cityId
    );
  }
  
  async getLayer(id: string): Promise<Layer | undefined> {
    return this.layers.get(id);
  }
  
  async createLayer(insertLayer: InsertLayer): Promise<Layer> {
    const id = randomUUID();
    const layer: Layer = { 
      id, 
      cityId: insertLayer.cityId,
      name: insertLayer.name,
      type: insertLayer.type,
      geoJSON: insertLayer.geoJSON
    };
    this.layers.set(id, layer);
    return layer;
  }
  
  async getBuildings(cityId: string): Promise<Building[]> {
    return Array.from(this.buildings.values()).filter(
      building => building.cityId === cityId
    );
  }
  
  async getBuilding(id: string): Promise<Building | undefined> {
    return this.buildings.get(id);
  }
  
  async getSensors(cityId: string): Promise<Sensor[]> {
    return Array.from(this.sensors.values()).filter(
      sensor => sensor.cityId === cityId
    );
  }
  
  async getSensor(id: string): Promise<Sensor | undefined> {
    return this.sensors.get(id);
  }
  
  async addSensorReading(
    sensorId: string, 
    reading: { timestamp: string; value: number; unit: string }
  ): Promise<Sensor> {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) {
      throw new Error(`Sensor ${sensorId} not found`);
    }
    sensor.readings.push(reading);
    return sensor;
  }
  
  async saveSimulation(simulation: Omit<SimulationResult, "id">): Promise<SimulationResult> {
    const id = randomUUID();
    const result: SimulationResult = { ...simulation, id };
    this.simulations.set(id, result);
    return result;
  }
  
  async getSimulations(cityId: string): Promise<SimulationResult[]> {
    return Array.from(this.simulations.values()).filter(
      sim => sim.cityId === cityId
    );
  }
  
  async saveProposal(proposal: Omit<RegenerativeProposal, "id">): Promise<RegenerativeProposal> {
    const id = randomUUID();
    const result: RegenerativeProposal = { ...proposal, id };
    this.proposals.set(id, result);
    return result;
  }
  
  async getProposals(cityId: string): Promise<RegenerativeProposal[]> {
    return Array.from(this.proposals.values()).filter(
      proposal => proposal.cityId === cityId
    );
  }
  
  async getProposalsByBuilding(buildingId: string): Promise<RegenerativeProposal[]> {
    return Array.from(this.proposals.values()).filter(
      proposal => proposal.buildingId === buildingId
    );
  }
}

export const storage = new MemStorage();
