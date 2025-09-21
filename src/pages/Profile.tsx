import { motion } from "framer-motion";
import { User, FileText, Clock, Settings } from "lucide-react";

const Profile = () => {
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
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-dark-text sm:text-5xl mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and track your legal document history
          </p>
        </motion.div>

        <motion.div
          className="bg-card rounded-lg shadow-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-hero rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-2">John Doe</h2>
            <p className="text-muted-foreground mb-8">john.doe@example.com</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-brand-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text">12</p>
                <p className="text-sm text-muted-foreground">Documents Analyzed</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text">48</p>
                <p className="text-sm text-muted-foreground">Chat Sessions</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text">Active</p>
                <p className="text-sm text-muted-foreground">Account Status</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;