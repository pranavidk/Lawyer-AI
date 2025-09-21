import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

const Settings = () => {
  const settingSections = [
    {
      icon: User,
      title: "Account Settings",
      description: "Update your personal information and preferences",
      items: ["Email", "Password", "Display Name", "Time Zone"]
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Control how you receive updates and alerts",
      items: ["Email Notifications", "Push Notifications", "Analysis Updates", "Chat Alerts"]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy settings and security options",
      items: ["Two-Factor Authentication", "Data Privacy", "Document Retention", "Access Logs"]
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize the look and feel of JuriSense",
      items: ["Theme", "Font Size", "Language", "Layout Preferences"]
    }
  ];

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
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-dark-text sm:text-5xl mb-4">
            Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your JuriSense experience and preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          {settingSections.map((section, index) => (
            <motion.div
              key={section.title}
              className="bg-card rounded-lg shadow-card p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-text mb-2">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {section.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {section.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between p-3 bg-light-gray rounded border hover:bg-accent-blue/5 transition-colors cursor-pointer"
                      >
                        <span className="text-sm text-dark-text">{item}</span>
                        <div className="w-4 h-4 border border-accent-blue rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;