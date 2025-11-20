import { Upload, Play, Lightbulb, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Data",
    description: "Import GeoJSON building footprints, CSV sensor data, or connect to existing city databases."
  },
  {
    number: "02",
    icon: Play,
    title: "Simulate Scenarios",
    description: "Run energy, water, and material flow simulations with climate-adjusted models for accurate predictions."
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Generate Proposals",
    description: "AI analyzes your city and generates regenerative design interventions with ROI calculations."
  },
  {
    number: "04",
    icon: Rocket,
    title: "Implement Solutions",
    description: "Export detailed proposals with technical specs, cost estimates, and environmental impact metrics."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="text-how-it-works-title">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-subtitle">
            Four simple steps to transform your city
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary/20" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {step.number}
                  </div>
                  <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
