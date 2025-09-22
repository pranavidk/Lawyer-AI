import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const DisclaimerModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Show modal on first load
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      setIsVisible(true);
      // Auto-minimize after 10 seconds
      const timer = setTimeout(() => {
        setIsMinimized(true);
        localStorage.setItem('hasSeenDisclaimer', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenDisclaimer', 'true');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    localStorage.setItem('hasSeenDisclaimer', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Full Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isMinimized ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: isMinimized ? 0.8 : 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-card border border-border rounded-lg shadow-card max-w-md w-full p-6"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-accent-2" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Not Legal Advice
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    JuriSense provides general information and analysis for educational purposes only. 
                    This is not a substitute for professional legal advice. Always consult with a 
                    qualified attorney for specific legal matters.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleMinimize}
                      className="px-4 py-2 bg-accent-1 text-primary-bg rounded-md text-sm font-medium hover:bg-accent-1/90 transition-colors"
                    >
                      I Understand
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Minimized Version */}
          <AnimatePresence>
            {isMinimized && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 right-4 z-50"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-card border border-border rounded-lg shadow-card p-3 max-w-xs cursor-pointer"
                  onClick={() => setIsMinimized(false)}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-accent-2 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Not legal advice. Click to read full disclaimer.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                      }}
                      className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerModal;
