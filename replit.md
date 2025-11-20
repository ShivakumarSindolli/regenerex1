# RegeneraX - The Intelligence of Living Cities

## Overview

RegeneraX is an AI-powered urban digital twin platform that provides real-time city intelligence, regenerative design proposals, and climate simulations for sustainable urban planning. The system acts as a living digital twin of a city, understanding energy, water, and material flows while running lightweight simulations and generating regenerative architectural design proposals.

The platform enables urban planners, architects, and sustainability leaders to visualize city-level data through interactive geospatial maps, run resource consumption simulations, and receive AI-generated recommendations for sustainable interventions like green roofs, rainwater harvesting, and solar panel installations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with Vite for fast development and optimized production builds

**UI Component System**: Shadcn/ui (New York variant) built on Radix UI primitives, providing accessible and customizable components. The design system follows a modern, data-forward aesthetic balancing sophistication with accessibility.

**Styling**: Tailwind CSS with custom design tokens for spacing, typography, and colors. The typography system uses Inter (primary) and Space Grotesk (display) fonts from Google Fonts.

**State Management**: TanStack Query (React Query) for server state management with infinite stale time and disabled refetching by default for optimized performance.

**Routing**: Wouter for lightweight client-side routing

**Mapping**: React-Leaflet for interactive geospatial visualization, displaying building footprints, sensor locations, and city layers with GeoJSON support

**Charts**: Recharts for data visualization of energy consumption, water usage, and resource flow metrics

**Key Design Decisions**:
- Component-based architecture with clear separation between presentational and container components
- Path aliases configured (@/, @shared/, @assets/) for clean imports
- Mobile-first responsive design with consistent breakpoints
- Accessibility-first approach through Radix UI primitives

### Backend Architecture

**Runtime**: Node.js with Express.js for RESTful API endpoints

**Language**: TypeScript with strict type checking enabled across client, server, and shared code

**Data Persistence**: In-memory storage implementation (MemStorage class) with interface definition (IStorage) allowing future migration to persistent database without API changes. Drizzle ORM configured for PostgreSQL migration path.

**API Structure**:
- `/api/cities` - City CRUD operations
- `/api/cities/:id/layers` - GeoJSON layer management
- `/api/cities/:id/buildings` - Building data retrieval
- `/api/cities/:id/sensors` - Sensor network management
- `/api/simulate` - Resource flow simulation engine
- `/api/propose` - AI-powered regenerative design proposals
- `/api/chat` - Conversational AI city intelligence assistant

**Simulation Engine**: Custom lightweight simulation calculating energy demand, water consumption, and material flows based on building characteristics (area, floors, usage intensity) adjusted by city climate factors.

**Proposal Generator**: Rule-based system analyzing building properties to generate regenerative interventions with ROI calculations, cost estimates, and environmental impact metrics.

**Key Design Decisions**:
- Shared schema definitions between client and server preventing type mismatches
- Validation using Zod schemas for runtime type safety
- Middleware for request logging and JSON body parsing
- Development-only Vite middleware for hot module replacement

### Data Models

**City**: Geographic center coordinates, name, country, climate adjustment factor

**Building**: Polygon geometry (GeoJSON), type (residential/commercial), floor count, area, usage intensity, energy rating, and sustainability features (green roof, solar panels, rainwater harvesting, passive cooling)

**Layer**: GeoJSON feature collections for different data types (buildings, sensors, energy, water) associated with cities

**Sensor**: Point geometry with type (energy/water/temperature), location, and time-series readings array

**SimulationResult**: Building-level energy/water/material demands, stress levels, and city-wide totals

**RegenerativeProposal**: Array of interventions with type, description, metrics (energy reduction, water savings, temperature drop), cost estimates, ROI, and implementation timeline

**Key Design Decisions**:
- GeoJSON-first data model for seamless mapping integration
- Time-series data stored as arrays within sensor documents for simple forecasting
- Normalized relationships through IDs (cityId, buildingId) with denormalized GeoJSON for performance

## External Dependencies

### Third-Party Services

**OpenAI API**: Powers the conversational city intelligence assistant (/api/chat endpoint) for natural language queries about simulation results, metrics interpretation, and regenerative design guidance. Requires OPENAI_API_KEY environment variable.

**PostgreSQL Database** (configured, not yet implemented): Drizzle ORM configured with connection via DATABASE_URL environment variable. Migration files output to ./migrations directory. Currently using in-memory storage with interface allowing seamless migration.

### Key Libraries

**Geospatial Processing**:
- @turf/turf - Spatial calculations and GeoJSON manipulations
- leaflet + react-leaflet - Interactive map rendering
- @types/leaflet - TypeScript definitions

**Database & ORM**:
- drizzle-orm + drizzle-kit - Type-safe database toolkit
- @neondatabase/serverless - Serverless Postgres driver
- connect-pg-simple - PostgreSQL session store

**UI Components**:
- @radix-ui/* (20+ component primitives) - Accessible UI foundation
- class-variance-authority - Component variant management
- tailwindcss + autoprefixer - Utility-first styling

**Data Fetching & Forms**:
- @tanstack/react-query - Async state management
- @hookform/resolvers - Form validation integration
- zod - Schema validation

**Development Tools**:
- vite - Build tool and dev server
- tsx - TypeScript execution
- esbuild - Production bundling
- @replit/* plugins - Replit-specific development enhancements

### Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (for future migration from in-memory storage)
- `OPENAI_API_KEY` - OpenAI API authentication
- `NODE_ENV` - Environment flag (development/production)