import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeatureTiles from "../components/FeatureTiles";
import DocumentUploadSample from "../components/DocumentUploadSample";
import ChatSample from "../components/ChatSample";
import SplashScreen from "../components/SplashScreen";
import DisclaimerModal from "../components/DisclaimerModal";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('juriSenseVisited');
    if (visited === 'true') {
      setHasVisited(true);
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasVisited(true);
    localStorage.setItem('juriSenseVisited', 'true');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && !hasVisited ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
