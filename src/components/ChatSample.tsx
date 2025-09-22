import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { queryOllama } from "../lib/ollama_api";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatSample = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      content: `👋 Hello! I'm **JuriSense AI**, your personal legal assistant.

I can help you with:
- **Explaining complex legal terms** in plain English
- **Analyzing documents & providing summaries**
- **Predicting possible outcomes** of scenarios
- **Offering guidance** on legal concepts you may not know

What would you like me to assist you with today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    // Use functional update to ensure the latest state is used
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true); // Show typing indicator
    setError(null);

    try {
      // Create a legal-focused prompt for better responses
      const legalPrompt = `You are JuriSense AI, a helpful legal assistant. Please provide clear, accurate, and helpful legal information in plain English. Keep responses concise but informative. Remember to always advise users to consult with a qualified attorney for specific legal advice.

User question: ${currentInput}`;

      // Get response from Ollama
      const aiResponseText = await queryOllama(legalPrompt);
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        content: aiResponseText || "I apologize, but I couldn't generate a response at this time. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error("Failed to fetch from Ollama:", err);
      setError("Failed to get a response from the AI. Please make sure Ollama is running and try again.");
      
      // Add a fallback message
      const fallbackResponse: Message = {
        id: crypto.randomUUID(),
        content: "I'm having trouble connecting to the AI service. Please make sure Ollama is running on your system and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.section
      className="py-16 bg-light-gray"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-dark-text sm:text-4xl mb-4">
            JuriSense AI Preview
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience conversational legal guidance
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg bg-card shadow-card overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Chat Header */}
          <div className="bg-brand-blue px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              JuriSense AI Assistant
            </h3>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-accent-blue text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {!message.isUser && (
                      <Bot className="h-4 w-4 mt-0.5 text-accent-blue flex-shrink-0" />
                    )}
                    {message.isUser && (
                      <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-accent-blue" />
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-accent-blue rounded-full"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-accent-blue rounded-full"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-accent-blue rounded-full"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error message display */}
            {error && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-red-100 text-red-600">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a legal question..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-foreground placeholder:text-muted-foreground bg-background"
                disabled={isTyping}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ChatSample;
