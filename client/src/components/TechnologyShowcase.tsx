import { Check } from "lucide-react";
import technologyImage from "@assets/generated_images/Urban_mapping_interface_screenshot_bfb84560.png";

const benefits = [
  "Geospatial GeoJSON data processing with MongoDB indexes",
  "Real-time simulations using climate-adjusted models",
  "OpenAI-powered conversational city intelligence",
  "Turf.js spatial calculations for precise analysis",
  "React + Leaflet interactive mapping interface",
  "Time-series forecasting for resource planning"
];

export default function TechnologyShowcase() {
  return (
    <section className="py-24 bg-accent/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="text-technology-title">
            Built for the Future of Urban Planning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-technology-subtitle">
            Powered by cutting-edge geospatial technology and AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-lg overflow-hidden border bg-card">
            <img
              src={technologyImage}
              alt="Urban mapping interface"
              className="w-full h-auto"
              data-testid="img-technology"
            />
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4" data-testid={`benefit-${index}`}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <p className="text-base md:text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
