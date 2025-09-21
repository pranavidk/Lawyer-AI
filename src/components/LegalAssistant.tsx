import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, FileText, AlertTriangle, Lightbulb, Scale, Home, MessageSquare, Settings, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createAIService, AI_CONFIG } from "@/services/aiService";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const LegalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const { toast } = useToast();
  
  const aiService = createAIService();

  const quickActions = [
    {
      title: "Contract Clause Analysis",
      description: "Analyze and summarize contract clauses",
      icon: FileText,
      prompt: "Please analyze this contract clause and provide a summary with potential scenarios"
    },
    {
      title: "Legal Term Explanation",
      description: "Explain complex legal terminology",
      icon: Lightbulb,
      prompt: "Please explain this legal term and provide examples of how it's used"
    },
    {
      title: "Compliance Scenarios",
      description: "Understand compliance implications",
      icon: Scale,
      prompt: "What are the compliance scenarios and implications for this clause?"
    }
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Use the pluggable AI service
      const response = await aiService.sendMessage(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI service error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (inputText.trim()) {
      handleSendMessage(`${prompt}: ${inputText}`);
    } else {
      toast({
        title: "Input Required",
        description: "Please enter some legal text first before using quick actions.",
        variant: "destructive"
      });
    }
  };

  const navigationItems = [
    { id: "chat", label: "Legal Assistant", icon: MessageSquare },
    { id: "library", label: "Legal Library", icon: BookOpen },
    { id: "settings", label: "AI Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-legal-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Legal AI Assistant
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`btn-glossy ${
                    activeTab === item.id 
                      ? "bg-gradient-button text-white shadow-button" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-hero p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-8 w-8" />
            <h2 className="text-2xl font-bold">
              {activeTab === "chat" && "AI-Powered Legal Analysis"}
              {activeTab === "library" && "Legal Document Library"}
              {activeTab === "settings" && "AI Configuration"}
            </h2>
          </div>
          <p className="text-purple-100">
            {activeTab === "chat" && `Legal clause analysis for Indian law context • Using ${AI_CONFIG.provider} AI`}
            {activeTab === "library" && "Access legal documents and precedents"}
            {activeTab === "settings" && "Configure your AI assistant settings"}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-6">
        {activeTab === "chat" && (
          <>
        {/* Disclaimer */}
        <Card className="border-legal-accent/20 bg-legal-accent/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-legal-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-legal-neutral">Important Disclaimer</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This tool provides educational summaries and scenario analysis only. It does not constitute legal advice. 
                  Always consult with a qualified legal professional for specific legal guidance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-card transition-all duration-200 border-l-4 border-l-legal-primary"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-legal-primary" />
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analysis History
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-legal-primary text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-legal-primary border-t-transparent rounded-full"></div>
                          <span className="text-sm text-muted-foreground">Analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Enter legal text, clause, or ask a question about Indian law..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[100px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Indian Law Context
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Educational Use Only
                  </Badge>
                </div>
                <Button 
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="btn-glossy bg-gradient-button hover:shadow-button transition-all duration-200"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </>
        )}

        {activeTab === "library" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Legal Document Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Legal document library coming soon. This will contain legal precedents, 
                case studies, and document templates relevant to Indian law.
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current AI Provider</h4>
                <Badge variant="outline" className="mb-4">
                  {AI_CONFIG.provider === 'local' ? 'Local LLM' : 'Mock AI (Development)'}
                </Badge>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">📝 Integration Instructions:</h5>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>1. Update <code>src/services/aiService.ts</code> to configure your local LLM</p>
                    <p>2. Set <code>AI_CONFIG.provider = 'local'</code></p>
                    <p>3. Update <code>AI_CONFIG.localApiEndpoint</code> to your LLM's API endpoint</p>
                    <p>4. Implement the API call in <code>LocalLLMService.sendMessage()</code></p>
                  </div>
                </div>
                
                {AI_CONFIG.provider === 'local' && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400">✅ Local LLM integration active</p>
                    <p className="text-xs text-green-300">Endpoint: {AI_CONFIG.localApiEndpoint}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LegalAssistant;