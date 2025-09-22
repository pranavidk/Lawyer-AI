import { motion } from "framer-motion";
import { HelpCircle, Mail, MessageSquare, FileText, Book } from "lucide-react";

const Help = () => {
  const helpCategories = [
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Learn how to upload and analyze legal documents",
      articles: [
        "How to upload documents",
        "Understanding analysis results",
        "Supported file formats",
        "Document security"
      ]
    },
    {
      icon: MessageSquare,
      title: "Chat Assistant",
      description: "Get the most out of our AI chat assistant",
      articles: [
        "How to ask effective questions",
        "Understanding AI responses", 
        "Chat history and sessions",
        "Best practices for legal queries"
      ]
    },
    {
      icon: Book,
      title: "Legal Resources",
      description: "Educational content and legal guides",
      articles: [
        "Understanding legal terminology",
        "Common legal document types",
        "Legal concepts explained",
        "When to consult a lawyer"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-dark-text sm:text-5xl mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions and learn how to use JuriSense effectively
          </p>
        </motion.div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              className="bg-card rounded-lg shadow-card p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
                  <category.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </div>
              
              <div className="space-y-2">
                {category.articles.map((article) => (
                  <div
                    key={article}
                    className="p-3 bg-light-gray rounded hover:bg-accent-blue/5 transition-colors cursor-pointer"
                  >
                    <p className="text-sm text-dark-text">{article}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          className="bg-gradient-hero rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Still need help?
          </h2>
          <p className="text-blue-100 mb-6">
            Our team is here to help you with any questions or issues
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Mail className="w-5 h-5 text-white" />
            <a
              href="mailto:shaurya.gupta2306@gmail.com"
              className="text-white hover:text-blue-200 transition-colors"
            >
              shaurya.gupta2306@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Help;