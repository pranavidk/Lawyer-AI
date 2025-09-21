import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeatureTiles from "../components/FeatureTiles";
import DocumentUploadSample from "../components/DocumentUploadSample";
import ChatSample from "../components/ChatSample";
import SplashScreen from "../components/SplashScreen";
import DisclaimerModal from "../components/DisclaimerModal";

const Index = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('juriSenseVisited');
    if (visited !== 'true') {
      setShowSplash(true);
    }
    setIsLoading(false);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('juriSenseVisited', 'true');
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSection />
            <FeatureTiles />
            <DocumentUploadSample />
            <ChatSample />
            <DisclaimerModal />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
