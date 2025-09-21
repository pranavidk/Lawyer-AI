import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeatureTiles from "../components/FeatureTiles";
import DocumentUploadSample from "../components/DocumentUploadSample";
import ChatSample from "../components/ChatSample";
import IntroScreen from "../components/IntroScreen";
import DisclaimerPopup from "../components/DisclaimerPopup";
import DisclaimerModal from "../components/DisclaimerModal";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true); // Start with intro shown
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a fresh page load (not navigation)
    const isNavigation = sessionStorage.getItem('juriSenseNavigation');
    
    if (isNavigation) {
      // This is navigation - hide intro immediately
      setShowIntro(false);
    }
    
    // Clear the navigation flag
    sessionStorage.removeItem('juriSenseNavigation');
    setIsLoading(false);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Show disclaimer popup after intro completes
    setTimeout(() => {
      setShowDisclaimer(true);
    }, 500);
  };

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
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

      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <DisclaimerPopup onClose={handleDisclaimerClose} />
      )}
    </>
  );
};

export default Index;
