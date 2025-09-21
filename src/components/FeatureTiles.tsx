import { motion } from "framer-motion";
import { FileText, BookOpen, MessageSquare, User, Settings, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureTiles = () => {
  const features = [
    {
      title: "Document Analyzer",
      description: "Upload and analyze legal documents with AI-powered insights",
      icon: FileText,
      path: "/document-analyzer",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Chat Assistant",
      description: "Get instant legal guidance through conversational AI",
      icon: MessageSquare,
      path: "/chat",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Profile",
      description: "Manage your account and legal document history",
      icon: User,
      path: "/profile",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Settings",
      description: "Customize your JuriSense experience and preferences",
      icon: Settings,
      path: "/settings",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Help & Support",
      description: "Get assistance and learn how to use JuriSense effectively",
      icon: HelpCircle,
      path: "/help",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const tileVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <section className="py-16 bg-light-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-dark-text sm:text-4xl">
            Powerful Legal AI Tools
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to understand legal documents and get clear explanations
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={tileVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={feature.path}
                className="block h-full rounded-lg bg-card p-6 shadow-card transition-all duration-300 hover:shadow-hover"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-dark-text">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureTiles;