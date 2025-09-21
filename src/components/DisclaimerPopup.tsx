import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, AlertTriangle, BookOpen } from "lucide-react";

interface DisclaimerPopupProps {
  onClose: () => void;
}

const DisclaimerPopup = ({ onClose }: DisclaimerPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blur Background */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
          />

          {/* Popup Content */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md mx-4 p-8 border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close disclaimer"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </motion.button>

            {/* Header */}
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Important Notice
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Educational Purpose Only
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">This application is for educational purposes only.</strong>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    The information provided by JuriSense AI is not intended to be, and should not be construed as, legal advice.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 dark:text-amber-200 font-medium text-sm">
                      ⚠️ Important Warning
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                      Always consult with qualified legal professionals for specific legal matters. 
                      Do not rely solely on AI-generated information for critical legal decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  By continuing to use this application, you acknowledge that you understand and agree to these terms.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={handleClose}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              I Understand
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerPopup;
