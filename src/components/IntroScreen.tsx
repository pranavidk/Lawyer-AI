import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [showText, setShowText] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSlogan, setShowSlogan] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 300);

    const loadingTimer = setTimeout(() => {
      setShowLoading(true);
    }, 1500);

    const sloganTimer = setTimeout(() => {
      setShowSlogan(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(loadingTimer);
      clearTimeout(sloganTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      rotateX: -90,
      scale: 0.5
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    })
  };

  const loadingVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const sloganVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-bg via-secondary-bg to-primary-bg"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent-1/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent-2/10 rounded-full blur-lg"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="text-center relative z-10">
        {/* JuriSense Text Animation */}
        {showText && (
          <motion.div className="mb-8">
            <div className="flex justify-center space-x-2">
              {"JuriSense".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-6xl md:text-8xl font-bold text-text-primary"
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    textShadow: "0 0 30px hsl(var(--accent-1) / 0.5)",
                    fontFamily: "Helvetica, Helvetica Neue, Arial, sans-serif"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        {showLoading && (
          <motion.div
            className="mb-8 flex flex-col items-center"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-center items-center space-x-2 mb-4">
              {/* Pulsing Dots */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-accent-1 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            
            {/* Loading Text */}
            <motion.p
              className="text-sm text-accent-1/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.5 }}
            >
              Loading JuriSense AI...
            </motion.p>
          </motion.div>
        )}

        {/* Slogan */}
        {showSlogan && (
          <motion.div
            variants={sloganVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              className="text-xl md:text-2xl text-accent-1 font-medium"
              style={{
                textShadow: "0 0 20px hsl(var(--accent-1) / 0.3)",
                fontFamily: "Helvetica, Helvetica Neue, Arial, sans-serif"
              }}
            >
              Your AI Legal Companion — Secure, Smart, Simple
            </motion.p>
          </motion.div>
        )}

        {/* Animated Legal Icon */}
        {showLoading && (
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 2.5, 
              duration: 1, 
              type: "spring", 
              stiffness: 150,
              damping: 15
            }}
          >
            <div className="w-16 h-16 rounded-full bg-accent-1/20 backdrop-blur-sm flex items-center justify-center border border-accent-1/30">
              <motion.div
                className="w-8 h-8 border-2 border-accent-1 rounded-lg relative"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.div
                  className="absolute inset-1 border border-accent-1/50 rounded"
                  animate={{ 
                    scale: [1, 0.8, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
};

export default IntroScreen;
