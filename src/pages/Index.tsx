import { Button } from "@/components/ui/button";
import FeatureTile from "@/components/FeatureTile";
import { 
  MessageSquareText, 
  FileText, 
  Sparkles, 
  DollarSign, 
  Users, 
  Mail,
  ArrowRight,
  CheckCircle,
  Scale
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Chat with AI",
      description: "Ask legal questions and get clear, simple answers in plain English from our AI assistant.",
      icon: MessageSquareText,
      href: "/chat"
    },
    {
      title: "Upload Documents",
      description: "Instantly understand contracts and agreements with AI-powered document analysis.",
      icon: FileText,
      href: "/upload"
    },
    {
      title: "Features",
      description: "Explore how our AI simplifies legal complexity with advanced natural language processing.",
      icon: Sparkles,
      href: "/features"
    },
    {
      title: "Pricing",
      description: "Choose the right plan for your needs with transparent, affordable pricing options.",
      icon: DollarSign,
      href: "/pricing"
    },
    {
      title: "About Us",
      description: "Learn more about our mission to make legal language accessible to everyone.",
      icon: Users,
      href: "/about"
    },
    {
      title: "Contact",
      description: "Get in touch with our team for support, demos, or enterprise solutions.",
      icon: Mail,
      href: "/contact"
    }
  ];

  const benefits = [
    "Save thousands on legal consultation fees",
    "Understand documents in minutes, not hours",
    "Make informed decisions with confidence",
    "Available 24/7 whenever you need help"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-highlight py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Scale className="h-10 w-10" />
              <span className="text-2xl font-bold">LegalAI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Understand Legal Language 
              <span className="block text-highlight">with Ease</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Ask questions, upload documents, and get clear explanations in plain English — 
              powered by AI for legal clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90 text-lg px-8 py-4 h-auto">
                <Link to="/chat">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg px-8 py-4 h-auto">
                <Link to="/upload">
                  Upload Document
                </Link>
              </Button>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-white/90">
                  <CheckCircle className="h-5 w-5 text-highlight flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-highlight/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Legal Clarity
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our comprehensive suite of AI-powered legal tools designed to make 
              complex legal language accessible and understandable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureTile key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Trusted by Businesses and Individuals Worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">1,000+</div>
              <p className="text-muted-foreground">Documents Analyzed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
              <p className="text-muted-foreground">AI Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Legal Complexity?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making better legal decisions with our AI assistant. 
            Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-highlight">
              <Link to="/chat">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90">
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
