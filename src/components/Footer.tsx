import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <motion.footer
      className="border-t border-border bg-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Copyright */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-muted-foreground">
              © 2025 JuriSense — Trusted explanations, not legal advice.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/help"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </Link>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="flex items-center justify-center space-x-2 md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href="mailto:shaurya.gupta2306@gmail.com"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;