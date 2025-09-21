import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  Award, 
  Heart,
  Lightbulb,
  Shield,
  Globe,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously push the boundaries of AI technology to make legal language more accessible and understandable for everyone."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your privacy and data security are our top priorities. We maintain the highest standards of confidentiality and protection."
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Legal knowledge shouldn't be limited to lawyers. We're democratizing access to legal understanding for individuals and businesses."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "We aim to break down legal barriers worldwide, helping people make informed decisions regardless of their legal background."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to make legal language accessible to everyone through AI technology."
    },
    {
      year: "2024",
      title: "AI Platform Launch",
      description: "Launched our first AI-powered legal assistant capable of explaining complex legal documents."
    },
    {
      year: "2024",
      title: "1,000+ Users",
      description: "Reached our first thousand users, helping small businesses and individuals understand legal documents."
    },
    {
      year: "2024",
      title: "Multi-Jurisdiction Support",
      description: "Expanded our AI to understand legal differences across multiple jurisdictions and regions."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      description: "Former legal tech executive with 15+ years in legal innovation and AI development."
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "CTO & Co-founder", 
      description: "AI researcher specializing in natural language processing and legal document analysis."
    },
    {
      name: "Jennifer Taylor",
      role: "Head of Legal",
      description: "Practicing attorney with expertise in contract law and regulatory compliance."
    },
    {
      name: "David Kim",
      role: "Head of Product",
      description: "Product strategist focused on making complex technology accessible to everyday users."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simplifying Legal Language for Everyone
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-3xl mx-auto">
            We believe that understanding legal documents shouldn't require a law degree. 
            Our mission is to make legal language accessible, clear, and understandable for everyone.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize legal understanding by providing AI-powered tools that translate 
                complex legal language into plain English. We empower individuals and businesses 
                to make informed decisions without the traditional barriers of legal complexity and cost.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-highlight/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-highlight" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where legal knowledge is accessible to all. We envision a future where 
                anyone can understand their rights, obligations, and legal documents without 
                needing extensive legal training or expensive consultations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Journey</Badge>
            <h2 className="text-3xl font-bold mb-4">Company Milestones</h2>
            <p className="text-muted-foreground text-lg">
              Key moments in our mission to make legal language accessible.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-bold flex-shrink-0 relative z-10">
                    {index + 1}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{milestone.year}</Badge>
                      <h3 className="font-semibold text-lg">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl font-bold mb-4">Meet the People Behind LegalAI</h2>
            <p className="text-muted-foreground text-lg">
              A diverse team of legal experts, AI researchers, and product innovators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-secondary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-muted/30 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already making better legal decisions with our AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-highlight">
              <Link to="/chat">
                Try Our AI Assistant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;