import { motion } from "framer-motion";
import { Mail, MessageSquare, Clock } from "lucide-react";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-dark-text sm:text-5xl mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground">
            We're here to help with any questions about JuriSense
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-lg shadow-card p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-text">Email Support</h3>
                  <p className="text-muted-foreground">Get help via email</p>
                </div>
              </div>
              <a
                href="mailto:shaurya.gupta2306@gmail.com"
                className="text-brand-blue hover:underline"
              >
                shaurya.gupta2306@gmail.com
              </a>
            </div>

            <div className="bg-card rounded-lg shadow-card p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-text">AI Assistant</h3>
                  <p className="text-muted-foreground">Try our chat assistant first</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Many questions can be answered instantly by our AI assistant.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-card p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-text">Response Time</h3>
                  <p className="text-muted-foreground">We typically respond within 24 hours</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-card rounded-lg shadow-card p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-dark-text mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-foreground placeholder:text-muted-foreground bg-background"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-foreground placeholder:text-muted-foreground bg-background"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-foreground placeholder:text-muted-foreground bg-background"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-foreground placeholder:text-muted-foreground bg-background"
                  placeholder="Tell us more about your question or issue..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;