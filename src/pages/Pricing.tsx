import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for trying out our AI legal assistant",
      features: [
        "5 AI chat questions per month",
        "1 document analysis per month",
        "Basic explanations",
        "Email support",
        "Standard processing speed"
      ],
      limitations: ["Limited monthly usage", "Basic features only"],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Standard",
      price: "$29",
      period: "/month",
      description: "Ideal for small businesses and regular users",
      features: [
        "100 AI chat questions per month",
        "10 document analyses per month",
        "Detailed explanations with examples",
        "Priority email support",
        "Fast processing speed",
        "Jurisdiction-specific guidance",
        "Document history & search"
      ],
      limitations: [],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro", 
      price: "$79",
      period: "/month",
      description: "For professionals and growing teams",
      features: [
        "Unlimited AI chat questions",
        "50 document analyses per month",
        "Advanced risk assessment",
        "Phone & email support",
        "Fastest processing speed",
        "Multi-jurisdiction support",
        "Team collaboration tools",
        "API access",
        "Custom integrations",
        "Advanced analytics"
      ],
      limitations: [],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be prorated accordingly."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and never store your sensitive documents permanently. All data is processed securely and deleted after analysis."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Is this actual legal advice?",
      answer: "No, our AI provides explanations and educational content, not legal advice. Always consult with a qualified attorney for specific legal matters."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-3xl mx-auto">
            Choose the perfect plan for your legal understanding needs. Start free and scale as you grow.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`card-hover relative ${plan.popular ? 'ring-2 ring-secondary shadow-xl' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-secondary text-secondary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start space-x-3 opacity-60">
                      <div className="h-4 w-4 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>

                <Button asChild 
                  variant={plan.buttonVariant} 
                  className={`w-full ${plan.popular ? 'btn-highlight' : ''}`}
                  size="lg"
                >
                  <Link to="/chat">{plan.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Need Something More?</h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              For large organizations, law firms, and enterprise users, we offer custom solutions 
              tailored to your specific needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {[
                "Unlimited usage",
                "Custom AI training",
                "White-label solutions",
                "Dedicated support",
                "On-premise deployment",
                "Custom integrations"
              ].map((feature, index) => (
                <Badge key={index} variant="secondary">{feature}</Badge>
              ))}
            </div>
            <Button asChild size="lg" className="btn-highlight">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Get answers to common questions about our pricing and service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;