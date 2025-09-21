import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8" />
              <span className="font-bold text-xl">LegalAI</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm">
              Simplifying legal language with AI-powered explanations and document analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-highlight transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-highlight transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-highlight transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-highlight transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/chat" className="hover:text-highlight transition-colors">
                  AI Legal Q&A
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-highlight transition-colors">
                  Document Analysis
                </Link>
              </li>
              <li>
                <span className="text-primary-foreground/60">Contract Review</span>
              </li>
              <li>
                <span className="text-primary-foreground/60">Legal Research</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@legalai.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1-800-LEGAL-AI</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-primary-foreground/80">
              © 2024 LegalAI. All rights reserved.
            </div>
            
            {/* Legal Disclaimer */}
            <div className="bg-highlight/20 border border-highlight/30 rounded-lg p-3 max-w-2xl">
              <div className="flex items-start space-x-2">
                <Scale className="h-5 w-5 text-highlight mt-0.5 flex-shrink-0" />
                <p className="text-sm text-primary-foreground/90">
                  <strong>⚖️ Disclaimer:</strong> This platform provides explanations, not legal advice.
                  Always consult with a qualified attorney for legal matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;