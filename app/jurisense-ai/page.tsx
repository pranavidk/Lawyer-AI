'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function JuriSenseAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hey there! 👋 I'm JuriSense AI, your chill legal buddy. I can help you understand legal terms in plain English, walk through scenarios, and explain laws without all the fancy jargon. What's on your mind?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getMockResponse(inputValue.trim()),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('indemnity') || input.includes('indemnify')) {
      return "Ah, indemnity! 😊 Think of it like a 'you break it, you buy it' promise, but for legal stuff. If someone sues you because of something I did, I promise to pay for your legal costs and any damages. It's basically legal insurance between parties. Pretty common in contracts!"
    }
    
    if (input.includes('force majeure')) {
      return "Force majeure is like the legal version of 'act of God' 🌪️. It's when something totally unexpected happens (like a pandemic, earthquake, or war) that makes it impossible to fulfill a contract. During COVID, tons of companies used this to delay deliveries. It's basically saying 'sorry, but the universe had other plans!'"
    }
    
    if (input.includes('breach') || input.includes('breach of contract')) {
      return "A breach is when someone doesn't hold up their end of the deal 🤝. Like if you promise to deliver pizza by 6 PM but show up at 8 PM - that's a breach! The consequences depend on how serious it is. Minor breach? Maybe just fix it. Major breach? Could end the whole contract and lead to lawsuits."
    }
    
    if (input.includes('liability') || input.includes('liable')) {
      return "Liability is basically 'who's responsible when things go wrong' 🤷‍♂️. If you're liable for something, you're on the hook for the consequences. Companies often try to limit their liability in contracts - like saying 'we're not responsible if our software crashes and you lose money.' But courts don't always let them get away with that!"
    }
    
    if (input.includes('scenario') || input.includes('what if')) {
      return "I love scenarios! 🎭 Give me the details - what's the situation? Who's involved? What went wrong (or might go wrong)? I'll walk through the likely outcomes, what laws apply, and what you should probably do next. Keep it real and I'll keep it simple!"
    }
    
    return "That's an interesting question! 🤔 I'm still learning, but I can help explain legal terms in plain English, walk through scenarios, or discuss relevant laws. Try asking about specific terms like 'indemnity' or 'force majeure', or describe a situation you're curious about. I'm here to make legal stuff less scary!"
  }

  return (
    <div className="min-h-screen dark:bg-aurora-primary light:bg-light-primary transition-colors duration-300">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-aurora-accent1 to-aurora-accent2 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Bot className="h-10 w-10 text-aurora-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold dark:text-aurora-text light:text-light-text mb-4">
              JuriSense AI
            </h1>
            <p className="text-lg dark:text-aurora-text/80 light:text-light-text/80 max-w-2xl mx-auto">
              Your casual legal companion. Ask me anything about legal terms, scenarios, or laws - I'll explain it in plain English! 😊
            </p>
          </div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="dark:bg-aurora-secondary light:bg-white rounded-2xl shadow-lg border dark:border-aurora-accent1/20 light:border-gray-200 h-[600px] flex flex-col"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-aurora-accent1 to-aurora-accent2 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-aurora-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-aurora-accent1 to-aurora-accent2 text-aurora-primary'
                          : 'dark:bg-aurora-primary light:bg-gray-100 dark:text-aurora-text light:text-light-text'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-aurora-primary/70' : 'dark:text-aurora-text/60 light:text-light-text/60'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-aurora-accent1 to-aurora-accent2 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-aurora-primary" />
                  </div>
                  <div className="dark:bg-aurora-primary light:bg-gray-100 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-aurora-accent1 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-aurora-accent1 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-aurora-accent1 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t dark:border-aurora-accent1/20 light:border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about legal terms, scenarios, or laws..."
                  className="flex-1 px-4 py-3 dark:bg-aurora-primary light:bg-gray-50 dark:text-aurora-text light:text-light-text border dark:border-aurora-accent1/30 light:border-gray-300 rounded-xl focus:ring-2 focus:ring-aurora-accent1 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-aurora-accent1 to-aurora-accent2 text-aurora-primary rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
