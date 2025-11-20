import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImage from "@assets/generated_images/Smart_city_digital_twin_visualization_3dd1ba9e.png";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="text-hero-title">
                RegeneraX: The Intelligence of Living Cities
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl" data-testid="text-hero-subtitle">
                Transform urban planning with AI-powered digital twin technology. Real-time city intelligence, regenerative design proposals, and climate simulations for sustainable cities.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" data-testid="button-explore-demo">
                Explore Demo
              </Button>
              <Button size="lg" variant="outline" data-testid="button-watch-video">
                <Play className="w-4 h-4 mr-2" />
                Watch Video
              </Button>
            </div>

            <p className="text-sm text-muted-foreground" data-testid="text-trust-indicator">
              Powering sustainable urban planning for cities worldwide
            </p>
          </div>

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden border bg-card">
              <img
                src={heroImage}
                alt="Futuristic city digital twin visualization"
                className="w-full h-auto"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
