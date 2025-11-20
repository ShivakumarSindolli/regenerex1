# RegeneraX Design Guidelines

## Design Approach
**Foundation:** Shadcn/ui components with custom adaptations for geospatial and simulation interfaces
**Visual Direction:** Modern, data-forward aesthetic balancing sophistication with accessibility - think Linear's clarity + Mapbox's cartographic precision + Notion's interface elegance

## Typography System
- **Primary Font:** Inter via Google Fonts (400, 500, 600, 700)
- **Display Font:** Space Grotesk for hero headlines and section titles
- **Hierarchy:**
  - Hero headline: text-5xl md:text-6xl lg:text-7xl font-bold
  - Section titles: text-3xl md:text-4xl font-bold
  - Subsections: text-xl md:text-2xl font-semibold
  - Body: text-base md:text-lg
  - Captions/metadata: text-sm

## Spacing System
**Consistent Tailwind Units:** 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 or p-8
- Section spacing: py-16 md:py-24
- Grid gaps: gap-6 or gap-8
- Container max-width: max-w-7xl

## Landing Page Structure

### Navigation Bar
- Fixed position with backdrop blur (backdrop-blur-md bg-white/80)
- Logo left, navigation links center, "Get Started" CTA right
- Links: Home, Features, Technology, About
- Height: h-16, horizontal padding: px-6

### Hero Section (100vh)
- **Layout:** Two-column on desktop (grid lg:grid-cols-2)
- **Left Column:** 
  - Headline: "RegeneraX: The Intelligence of Living Cities"
  - Subheading explaining digital twin + regenerative design
  - Two CTAs: "Explore Demo" (primary) + "Watch Video" (secondary outline)
  - Small trust indicator: "Powering sustainable urban planning"
- **Right Column:** Large hero image showing futuristic city visualization with data overlays
- Background: Subtle gradient mesh or geometric pattern

### Features Section
- **Grid Layout:** 3 columns desktop (grid md:grid-cols-3), cards with icons
- **Features:**
  1. "Real-Time City Intelligence" - geospatial monitoring icon
  2. "AI-Powered Proposals" - brain/architecture icon  
  3. "Climate Simulations" - weather/analytics icon
  4. "Resource Optimization" - circular economy icon
  5. "Interactive Mapping" - map pin icon
  6. "Predictive Analytics" - chart trending icon
- Each card: Icon top, title, 2-line description, "Learn more" link

### Technology Showcase Section
- **Layout:** Full-width with inner max-w-6xl
- Large heading: "Built for the Future of Urban Planning"
- **Grid:** 2 columns (md:grid-cols-2)
  - Left: Image showing the mapping interface in action
  - Right: Bullet points of tech stack benefits with checkmark icons

### How It Works Section
- **Timeline/Steps Layout:** Vertical on mobile, horizontal steps on desktop
- 4 steps with numbers: Upload Data → Simulate Scenarios → Generate Proposals → Implement Solutions
- Each step: Large number, title, description, connecting line/arrow

### CTA Section
- Centered content with gradient background
- Large headline: "Transform Your City with Regenerative Intelligence"
- Description paragraph
- Primary CTA button + secondary link
- Background: Abstract city skyline silhouette or data visualization pattern

### Footer
- **3-column layout:** 
  - Column 1: Logo + tagline
  - Column 2: Quick Links (Features, Technology, Pricing, Contact)
  - Column 3: Resources (Documentation, API, GitHub, Support)
- Bottom bar: Copyright + Social links (LinkedIn, Twitter, GitHub)

## Application Interface Design

### Map Page
- **Layout:** Full viewport height with sidebar
- **Sidebar:** Fixed left, w-80, shadcn Sheet/Drawer pattern
  - Search bar at top
  - Layer toggles (Buildings, Sensors, Energy Grid)
  - Selected building properties panel
  - Action buttons: "Run Simulation" + "Generate Proposal"
- **Map Canvas:** react-leaflet with custom controls
  - Zoom controls: Bottom right
  - Legend: Top right
  - Building polygons: Hover states with elevation effect

### Dashboard/Analytics Page
- **Grid Layout:** 12-column system
- **Top Row:** 4 metric cards (grid-cols-4): Energy, Water, Materials, Climate Score
- **Chart Section:** 2-column grid
  - Time-series line charts for consumption trends
  - Bar charts for building-by-building comparison
- Use shadcn Card components with proper padding

### Chat Assistant Interface
- **Position:** Fixed bottom-right corner, floating expandable panel
- **Collapsed:** Circular button with AI sparkle icon
- **Expanded:** w-96 h-[600px] card with messages list + input
- Message bubbles: User (right-aligned, primary bg), AI (left-aligned, muted bg)
- Input: Fixed bottom with send button

### Data Upload Interface
- **Card-based:** Centered max-w-2xl
- Drag-and-drop zone with shadcn styling
- File type badges (GeoJSON, CSV)
- Upload progress bar
- Preview table for uploaded data

## Component Library (Shadcn)

**Primary Components:**
- Button (default, outline, ghost variants)
- Card with CardHeader, CardContent, CardFooter
- Input and Select for forms
- Sheet for sidebars
- Dialog for modals
- Tabs for navigation
- Badge for status indicators
- Table for data display
- Separator for content divisions

**Custom Components:**
- MapControls (custom overlay on leaflet)
- MetricCard (extends shadcn Card)
- SimulationPanel (multi-step form)
- ProposalCard (intervention details with SVG preview)

## Interaction Patterns
- Map interactions: Click polygon → open sidebar panel with smooth slide-in
- Simulations: Multi-step wizard with progress indicator
- Proposals: Accordion-style list with expand/collapse
- Charts: Tooltips on hover with exact values
- Loading states: Skeleton screens using shadcn Skeleton component
- No distracting animations - focus on purposeful transitions (200-300ms ease-in-out)

## Images

**Hero Section:** 
Large, high-quality image showing a 3D city visualization with overlaid data points, energy flow lines, and transparent analytics panels. Should convey futuristic urban planning technology. Place in right column of hero grid.

**Technology Showcase:**
Screenshot or mockup of the actual mapping interface showing building polygons color-coded by energy efficiency, with sidebar panel open displaying metrics.

**Optional Section Images:**
- Team working with digital city models
- Before/after visualization of regenerative interventions
- Real-world sustainable architecture examples

## Key Principles
- **Data Visibility:** Information should be scannable at a glance
- **Spatial Clarity:** Maps are primary interface - give them breathing room
- **Progressive Disclosure:** Show summary → details on interaction
- **Trust Signals:** Technical sophistication balanced with approachability
- **Mobile Consideration:** Stack columns on mobile, maintain full map functionality