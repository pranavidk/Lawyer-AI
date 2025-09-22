import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-dark-text sm:text-5xl mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: January 2025
          </p>
        </motion.div>

        <motion.div
          className="bg-card rounded-lg shadow-card p-8 prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using JuriSense, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily use JuriSense for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">3. Disclaimer</h2>
              <p className="font-medium text-red-600">
                JuriSense provides AI-generated legal information for educational purposes only. 
                This is not legal advice and should not be used as a substitute for consultation 
                with a qualified attorney.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">4. Limitations</h2>
              <p>
                In no event shall JuriSense or its suppliers be liable for any damages arising 
                out of the use or inability to use the materials on JuriSense.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">5. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:shaurya.gupta2306@gmail.com" className="text-brand-blue hover:underline">
                  shaurya.gupta2306@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Terms;