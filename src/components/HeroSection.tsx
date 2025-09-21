import { motion } from "framer-motion";
import TypingText from "./TypingText";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-background via-light-gray to-blue-50/30">
      {/* Minimalistic Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-blue/5 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent-blue/8 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-highlight/10 rounded-full" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
        
        {/* Animated floating elements */}
        <motion.div
          className="absolute top-16 right-10 w-2 h-2 bg-brand-blue/20 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-1 h-1 bg-accent-blue/30 rounded-full"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h1
            className="text-5xl font-bold text-foreground sm:text-6xl md:text-7xl mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="block">JuriSense</span>
            <span className="block text-accent-1">AI Legal Assistant</span>
          </motion.h1>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <TypingText
              text="Your AI Legal Companion — Simple, Smart, Secure"
              className="text-2xl font-semibold text-accent-1 mb-6"
              delay={200}
              speed={60}
            />
          </motion.div>

          <motion.p
            className="mx-auto max-w-3xl text-xl text-muted-foreground mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Ask questions, upload documents, and get clear explanations in plain 
            English — powered by AI for legal clarity.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;