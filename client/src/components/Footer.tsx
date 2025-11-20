import { Link } from "wouter";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RX</span>
              </div>
              <span className="font-bold text-lg">RegeneraX</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-footer-tagline">
              The intelligence of living cities. Building sustainable urban futures through AI-powered digital twins.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/features" data-testid="link-footer-features">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">Features</div>
              </Link>
              <Link href="/technology" data-testid="link-footer-technology">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">Technology</div>
              </Link>
              <Link href="/pricing" data-testid="link-footer-pricing">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">Pricing</div>
              </Link>
              <Link href="/contact" data-testid="link-footer-contact">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">Contact</div>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <Link href="/docs" data-testid="link-footer-docs">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">Documentation</div>
              </Link>
              <Link href="/api" data-testid="link-footer-api">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">API</div>
              </Link>
              <Link href="/github" data-testid="link-footer-github-link">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">GitHub</div>
              </Link>
              <Link href="/support" data-testid="link-footer-support">
                <div className="text-sm text-muted-foreground hover-elevate px-2 py-1 rounded-md -ml-2">Support</div>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © 2025 RegeneraX. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover-elevate rounded-md p-2" data-testid="link-footer-linkedin">
              <Linkedin className="w-5 h-5 text-muted-foreground" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover-elevate rounded-md p-2" data-testid="link-footer-twitter">
              <Twitter className="w-5 h-5 text-muted-foreground" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover-elevate rounded-md p-2" data-testid="link-footer-github">
              <Github className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
