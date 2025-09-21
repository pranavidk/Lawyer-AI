import { motion } from "framer-motion";
import { MessageSquare, Brain, Clock, Lightbulb } from "lucide-react";
import ChatSample from "../components/ChatSample";

const ChatAssistant = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Advanced legal AI trained on extensive legal knowledge"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Get legal guidance anytime, day or night"
    },
    {
      icon: Lightbulb,
      title: "Clear Explanations",
      description: "Complex legal concepts explained in simple terms"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-1 rounded-full mb-6">
            <MessageSquare className="w-8 h-8 text-primary-bg" />
          </div>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-4">
            JuriSense AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a conversation with our AI legal assistant. Ask questions, 
            get explanations, and understand legal concepts in plain English.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-6 rounded-lg bg-card shadow-soft"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-1/10 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-accent-1" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Chat Component */}
        <ChatSample />
      </div>
    </motion.div>
  );
};

export default ChatAssistant;