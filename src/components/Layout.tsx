import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AnimatePresence mode="wait">
        <main className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;