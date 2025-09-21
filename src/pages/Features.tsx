import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileSearch, 
  Globe, 
  MessageSquareText, 
  Shield, 
  Zap,
  Clock,
  Users,
  CheckCircle
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Q&A",
      description: "Ask complex legal questions and receive clear, understandable answers in plain English. Our AI understands legal nuances and explains them simply.",
      benefits: ["Natural language processing", "Context-aware responses", "24/7 availability"]
    },
    {
      icon: FileSearch,
      title: "Clause Breakdown",
      description: "Upload contracts and legal documents to get instant analysis. We identify key clauses and explain their implications in everyday language.",
      benefits: ["Instant document analysis", "Risk assessment", "Plain English translations"]
    },
    {
      icon: Globe,
      title: "Jurisdiction Awareness",
      description: "Get legal explanations tailored to your specific jurisdiction. Our AI understands regional legal differences and provides relevant guidance.",
      benefits: ["Multi-jurisdiction support", "Local law awareness", "Regional compliance"]
    },
    {
      icon: MessageSquareText,
      title: "User-Friendly Summaries",
      description: "Complex legal documents are distilled into clear, actionable summaries that help you understand your rights and obligations.",
      benefits: ["Executive summaries", "Key points extraction", "Action item identification"]
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security ensures your sensitive legal documents remain confidential and protected."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant analysis and responses. No more waiting days for legal interpretations."
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Access legal assistance whenever you need it, without scheduling appointments or waiting for business hours."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share analyses with colleagues and collaborate on legal document reviews seamlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Legal Clarity
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with legal expertise 
            to make complex legal language accessible to everyone.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Main Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Core Features</Badge>
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Legal Understanding</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools designed to simplify legal complexity and empower informed decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Additional Benefits</Badge>
            <h2 className="text-3xl font-bold mb-4">Built for Modern Legal Needs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Perfect For</h2>
            <p className="text-muted-foreground">Who can benefit from AI Legal Assistant?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Small Business Owners",
                description: "Review contracts, understand compliance requirements, and make informed legal decisions without expensive legal fees.",
                examples: ["Service agreements", "Vendor contracts", "Employment documents"]
              },
              {
                title: "Entrepreneurs",
                description: "Navigate legal documentation for startups, understand investment terms, and protect your intellectual property.",
                examples: ["Funding agreements", "Partnership contracts", "Terms of service"]
              },
              {
                title: "Individuals",
                description: "Understand personal legal documents, tenant agreements, and consumer contracts before signing.",
                examples: ["Lease agreements", "Insurance policies", "Purchase contracts"]
              }
            ].map((useCase, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-lg">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.description}</p>
                <div className="space-y-1">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      <span className="text-sm text-muted-foreground">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;