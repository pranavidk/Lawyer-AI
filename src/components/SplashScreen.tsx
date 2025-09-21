import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
    }),
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-bg to-secondary-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="text-center">
        {showText && (
          <>
            <div className="mb-4 flex justify-center space-x-1">
              {"JuriSense".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-6xl font-bold text-text-primary md:text-7xl"
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: i * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="text-xl text-accent-1 md:text-2xl"
              variants={taglineVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 1.8,
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              Your AI Legal Companion — Secure, Smart, Simple
            </motion.p>
          </>
        )}
        
        {/* Animated Legal Icon */}
        <motion.div
          className="mt-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.2, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-accent-1/20 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              className="h-8 w-8 border-2 border-accent-1 rounded"
              animate={{ rotate: 360 }}
              transition={{ delay: 2.5, duration: 1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;