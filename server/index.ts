import dotenv from "dotenv";
dotenv.config();
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectMongo, getDb } from "./mongo";
import { bengaluruCity, bengaluruBuildings, bengaluruBuildingsLayer, bengaluruSensors, bengaluruSensorsLayer } from "./sampleData";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // If Mongo is configured, ensure sample data exists so the client has something to show.
  if (process.env.MONGODB_URI) {
    try {
      // connect and seed if empty
      await connectMongo(process.env.MONGODB_URI as string);
      const db = await getDb();
      const citiesCount = await db.collection('cities').countDocuments();
      if (citiesCount === 0) {
        log('Seeding MongoDB with sample city data...');
        await db.collection('cities').insertOne(bengaluruCity);
        // insert layers
        await db.collection('layers').insertMany([bengaluruBuildingsLayer, bengaluruSensorsLayer]);
        // insert buildings
        if (Array.isArray(bengaluruBuildings) && bengaluruBuildings.length > 0) {
          await db.collection('buildings').insertMany(bengaluruBuildings as any[]);
        }
        // insert sensors
        if (Array.isArray(bengaluruSensors) && bengaluruSensors.length > 0) {
          await db.collection('sensors').insertMany(bengaluruSensors as any[]);
        }
        log('MongoDB seeding complete.');
      }
    } catch (err) {
      console.error('Failed to seed MongoDB:', err);
    }
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const requestedPort = parseInt(process.env.PORT || '5000', 10);
  let attemptPort = requestedPort;

  // Handle listen errors (e.g., EADDRINUSE) gracefully by retrying the next port.
  server.on('error', (err: any) => {
    if (err && err.code === 'EADDRINUSE') {
      log(`port ${attemptPort} already in use, trying port ${attemptPort + 1}...`);
      attemptPort += 1;
      // small delay to avoid tight loop
      setTimeout(() => {
        server.listen({ port: attemptPort, host: '0.0.0.0' }, () => {
          log(`serving on port ${attemptPort}`);
        });
      }, 200);
      return;
    }
    console.error('Server error:', err);
    process.exit(1);
  });

  // First listen attempt
  server.listen({ port: attemptPort, host: '0.0.0.0' }, () => {
    log(`serving on port ${attemptPort}`);
  });
})();
