'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  FileText, 
  Scale, 
  BookOpen, 
  Shield, 
  MessageSquare, 
  User, 
  Settings,
  FileText as LegalSummaries
} from 'lucide-react'

const gridItems = [
  {
    title: 'Document Analyzer',
    description: 'Upload and analyze legal documents with AI-powered insights',
    icon: FileText,
    href: '/document-analyzer',
    color: 'from-aurora-accent1 to-aurora-accent2'
  },
  {
    title: 'Contract Analysis',
    description: 'Deep dive into contract clauses with severity analysis',
    icon: Scale,
    href: '#contract',
    color: 'from-aurora-accent2 to-aurora-accent1'
  },
  {
    title: 'Term Explanation',
    description: 'Get plain-English explanations of legal terms',
    icon: BookOpen,
    href: '#terms',
    color: 'from-aurora-accent1 to-aurora-accent2'
  },
  {
    title: 'Compliance',
    description: 'Check compliance for GST, IT Act, Employment & more',
    icon: Shield,
    href: '#compliance',
    color: 'from-aurora-accent2 to-aurora-accent1'
  },
  {
    title: 'Chat Assistant',
    description: 'Interactive AI assistant for legal queries',
    icon: MessageSquare,
    href: '#chat',
    color: 'from-aurora-accent1 to-aurora-accent2'
  },
  {
    title: 'Legal Summaries',
    description: 'Generate concise summaries of legal documents',
    icon: LegalSummaries,
    href: '/legal-summaries',
    color: 'from-aurora-accent2 to-aurora-accent1'
  },
  {
    title: 'Profile',
    description: 'Manage your account and preferences',
    icon: User,
    href: '/profile',
    color: 'from-aurora-accent1 to-aurora-accent2'
  },
  {
    title: 'Settings',
    description: 'Customize your JuriSense experience',
    icon: Settings,
    href: '/settings',
    color: 'from-aurora-accent2 to-aurora-accent1'
  }
]

export function HomepageGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // For future routing implementation
      console.log('Navigate to:', href)
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-aurora-text mb-6">
            Explore JuriSense
          </h2>
          <p className="text-xl text-aurora-text/80 max-w-3xl mx-auto">
            Choose from our comprehensive suite of AI-powered legal tools designed to simplify your legal workflow
          </p>
        </motion.div>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {gridItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(item.href)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full border border-gray-100 hover:border-aurora-accent1/30">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-aurora-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                  {item.description}
                </p>

                {/* Hover effect indicator */}
                <div className="mt-4 flex items-center text-aurora-accent1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Explore →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
