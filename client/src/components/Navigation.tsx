import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 -ml-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RX</span>
              </div>
              <span className="font-bold text-lg">RegeneraX</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" data-testid="link-nav-home">
              <span className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">Home</span>
            </Link>
            <Link href="/features" data-testid="link-nav-features">
              <span className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">Features</span>
            </Link>
            <Link href="/technology" data-testid="link-nav-technology">
              <span className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">Technology</span>
            </Link>
            <Link href="/about" data-testid="link-nav-about">
              <span className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">About</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <Button data-testid="button-get-started">Get Started</Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-6 py-4 space-y-3">
            <Link href="/" data-testid="link-mobile-home">
              <div className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">Home</div>
            </Link>
            <Link href="/features" data-testid="link-mobile-features">
              <div className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">Features</div>
            </Link>
            <Link href="/technology" data-testid="link-mobile-technology">
              <div className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">Technology</div>
            </Link>
            <Link href="/about" data-testid="link-mobile-about">
              <div className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">About</div>
            </Link>
            <Button className="w-full" data-testid="button-mobile-get-started">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
