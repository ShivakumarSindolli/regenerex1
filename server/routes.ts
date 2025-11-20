import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { runSimulation, forecastTimeSeries } from "./simulationEngine";
import { generateProposal } from "./proposalGenerator";
import { citySchema, layerSchema, sensorReadingSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const city = await storage.getCity(req.params.id);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch city" });
    }
  });

  app.post("/api/cities", async (req, res) => {
    try {
      const validated = citySchema.parse(req.body);
      const city = await storage.createCity(validated);
      res.status(201).json(city);
    } catch (error) {
      res.status(400).json({ error: "Invalid city data" });
    }
  });

  app.get("/api/cities/:id/layers", async (req, res) => {
    try {
      const layers = await storage.getLayers(req.params.id);
      res.json(layers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch layers" });
    }
  });

  app.post("/api/layers", async (req, res) => {
    try {
      const validated = layerSchema.parse(req.body);
      const layer = await storage.createLayer(validated);
      res.status(201).json(layer);
    } catch (error) {
      res.status(400).json({ error: "Invalid layer data" });
    }
  });

  app.get("/api/cities/:id/buildings", async (req, res) => {
    try {
      const buildings = await storage.getBuildings(req.params.id);
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buildings" });
    }
  });

  app.get("/api/buildings/:id", async (req, res) => {
    try {
      const building = await storage.getBuilding(req.params.id);
      if (!building) {
        return res.status(404).json({ error: "Building not found" });
      }
      res.json(building);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch building" });
    }
  });

  app.get("/api/cities/:id/sensors", async (req, res) => {
    try {
      const sensors = await storage.getSensors(req.params.id);
      res.json(sensors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sensors" });
    }
  });

  app.post("/api/sensors/:id/readings", async (req, res) => {
    try {
      const validated = sensorReadingSchema.parse(req.body);
      const reading = {
        timestamp: new Date().toISOString(),
        value: validated.value,
        unit: validated.unit,
      };
      const sensor = await storage.addSensorReading(req.params.id, reading);
      res.json(sensor);
    } catch (error) {
      res.status(400).json({ error: "Invalid sensor reading" });
    }
  });

  app.post("/api/simulate", async (req, res) => {
    try {
      const { cityId } = req.body;
      if (!cityId) {
        return res.status(400).json({ error: "City ID required" });
      }

      const city = await storage.getCity(cityId);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }

      const buildings = await storage.getBuildings(cityId);
      const simulationData = runSimulation(city, buildings);
      const result = await storage.saveSimulation(simulationData);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Simulation failed" });
    }
  });

  app.get("/api/cities/:id/simulations", async (req, res) => {
    try {
      const simulations = await storage.getSimulations(req.params.id);
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch simulations" });
    }
  });

  app.post("/api/propose", async (req, res) => {
    try {
      const { buildingId, cityId } = req.body;
      if (!buildingId || !cityId) {
        return res.status(400).json({ error: "Building ID and City ID required" });
      }

      const building = await storage.getBuilding(buildingId);
      if (!building) {
        return res.status(404).json({ error: "Building not found" });
      }

      const proposalData = generateProposal(building, cityId);
      const result = await storage.saveProposal(proposalData);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Proposal generation failed" });
    }
  });

  app.get("/api/cities/:id/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals(req.params.id);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/buildings/:id/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposalsByBuilding(req.params.id);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.post("/api/forecast", async (req, res) => {
    try {
      const { historicalValues, periods, alpha } = req.body;
      if (!historicalValues || !periods) {
        return res.status(400).json({ error: "Historical values and periods required" });
      }

      const forecast = forecastTimeSeries(historicalValues, periods, alpha);
      res.json({ forecast });
    } catch (error) {
      res.status(500).json({ error: "Forecast failed" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, cityId, contextMetrics } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message required" });
      }

      let systemPrompt = "You are RegeneraX, an AI assistant specialized in urban planning and regenerative city design. You help users understand city data, interpret simulations, and make informed decisions about sustainable interventions.";

      if (contextMetrics) {
        systemPrompt += `\n\nCurrent city metrics:\n${JSON.stringify(contextMetrics, null, 2)}\n\nIMPORTANT: Use ONLY the provided metrics in your responses. Do not invent or hallucinate numbers.`;
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't process that request.";
      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Chat request failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
