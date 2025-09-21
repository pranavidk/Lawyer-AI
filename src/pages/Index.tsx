import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeatureTiles from "../components/FeatureTiles";
import DocumentUploadSample from "../components/DocumentUploadSample";
import ChatSample from "../components/ChatSample";
import IntroScreen from "../components/IntroScreen";
import DisclaimerModal from "../components/DisclaimerModal";

const Index = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a fresh page load (not navigation)
    const isNavigation = sessionStorage.getItem('juriSenseNavigation');
    
    if (!isNavigation) {
      // This is a fresh page load or reload - show intro
      setShowIntro(true);
    }
    
    // Clear the navigation flag
    sessionStorage.removeItem('juriSenseNavigation');
    setIsLoading(false);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Show loading state while checking sessionStorage
  if (isLoading) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen onComplete={handleIntroComplete} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
