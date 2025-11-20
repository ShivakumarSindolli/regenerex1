import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, CloudRain, Recycle, MapPin, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time City Intelligence",
    description: "Monitor energy, water, and resource flows across your entire city with live geospatial data visualization."
  },
  {
    icon: Brain,
    title: "AI-Powered Proposals",
    description: "Generate regenerative design interventions using advanced AI models trained on sustainable architecture."
  },
  {
    icon: CloudRain,
    title: "Climate Simulations",
    description: "Run detailed climate scenario models to understand environmental impact and adaptation strategies."
  },
  {
    icon: Recycle,
    title: "Resource Optimization",
    description: "Identify opportunities for circular economy principles and material flow optimization."
  },
  {
    icon: MapPin,
    title: "Interactive Mapping",
    description: "Explore your city through intuitive 3D maps with building-level detail and data overlays."
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecast future trends in consumption, emissions, and urban development patterns."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="text-features-title">
            Comprehensive Urban Intelligence Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-subtitle">
            Everything you need to design, simulate, and implement regenerative city solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
