import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Privacy = () => {
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-dark-text sm:text-5xl mb-4">
            Privacy Policy
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
              <h2 className="text-2xl font-semibold text-dark-text mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                upload documents, or contact us for support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To analyze and improve our AI models</li>
                <li>To communicate with you about updates and support</li>
                <li>To ensure the security of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">3. Document Security</h2>
              <p className="font-medium text-green-600">
                Your uploaded documents are processed securely and are not stored permanently 
                on our servers. All document processing happens in encrypted, secure environments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">4. Data Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-dark-text mb-4">5. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. 
                Contact us at{" "}
                <a href="mailto:shaurya.gupta2306@gmail.com" className="text-brand-blue hover:underline">
                  shaurya.gupta2306@gmail.com
                </a>{" "}
                to exercise these rights.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Privacy;