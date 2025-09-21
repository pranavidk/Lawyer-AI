'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { apiService } from '@/lib/api'

interface ComplianceScenario {
  id: string
  name: string
  description: string
  fields: {
    id: string
    label: string
    type: 'text' | 'select' | 'number' | 'textarea'
    options?: string[]
    required: boolean
    placeholder?: string
  }[]
}

interface ComplianceResult {
  scenario: string
  flags: {
    severity: 'low' | 'medium' | 'high'
    issue: string
    description: string
    recommendation: string
  }[]
  nextSteps: string[]
  overallRisk: 'low' | 'medium' | 'high'
}

const scenarios: ComplianceScenario[] = [
  {
    id: 'gst',
    name: 'GST Compliance',
    description: 'Check GST registration and filing requirements',
    fields: [
      {
        id: 'business_type',
        label: 'Business Type',
        type: 'select',
        options: ['Individual', 'Partnership', 'Company', 'LLP', 'HUF'],
        required: true
      },
      {
        id: 'annual_turnover',
        label: 'Annual Turnover (₹)',
        type: 'number',
        required: true,
        placeholder: 'Enter annual turnover'
      },
      {
        id: 'business_activities',
        label: 'Business Activities',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your main business activities'
      },
      {
        id: 'current_gst_status',
        label: 'Current GST Status',
        type: 'select',
        options: ['Not Registered', 'Registered', 'Composition Scheme', 'Unknown'],
        required: true
      }
    ]
  },
  {
    id: 'it_act',
    name: 'IT Act Compliance',
    description: 'Data protection and cybersecurity requirements',
    fields: [
      {
        id: 'data_collection',
        label: 'Do you collect personal data?',
        type: 'select',
        options: ['Yes', 'No', 'Limited'],
        required: true
      },
      {
        id: 'data_storage',
        label: 'Where is data stored?',
        type: 'select',
        options: ['India Only', 'International', 'Cloud (India)', 'Cloud (International)', 'Mixed'],
        required: true
      },
      {
        id: 'business_size',
        label: 'Business Size',
        type: 'select',
        options: ['Startup (< 10 employees)', 'Small (10-50)', 'Medium (50-200)', 'Large (200+)'],
        required: true
      }
    ]
  },
  {
    id: 'employment',
    name: 'Employment Law',
    description: 'Labor law compliance for employers',
    fields: [
      {
        id: 'employee_count',
        label: 'Number of Employees',
        type: 'number',
        required: true,
        placeholder: 'Total employees'
      },
      {
        id: 'employment_type',
        label: 'Employment Types',
        type: 'select',
        options: ['Permanent Only', 'Contract Only', 'Mixed', 'Gig Workers'],
        required: true
      },
      {
        id: 'work_location',
        label: 'Work Location',
        type: 'select',
        options: ['Office Only', 'Remote Only', 'Hybrid', 'Multiple States'],
        required: true
      },
      {
        id: 'salary_structure',
        label: 'Salary Structure',
        type: 'select',
        options: ['Fixed Salary', 'Variable + Fixed', 'Commission Based', 'Mixed'],
        required: true
      }
    ]
  },
  {
    id: 'rental',
    name: 'Rental Agreement',
    description: 'Property rental compliance',
    fields: [
      {
        id: 'property_type',
        label: 'Property Type',
        type: 'select',
        options: ['Residential', 'Commercial', 'Industrial', 'Agricultural'],
        required: true
      },
      {
        id: 'rental_amount',
        label: 'Monthly Rent (₹)',
        type: 'number',
        required: true,
        placeholder: 'Enter monthly rent'
      },
      {
        id: 'agreement_duration',
        label: 'Agreement Duration (months)',
        type: 'number',
        required: true,
        placeholder: 'Duration in months'
      },
      {
        id: 'deposit_amount',
        label: 'Security Deposit (₹)',
        type: 'number',
        required: true,
        placeholder: 'Enter security deposit'
      },
      {
        id: 'state',
        label: 'State',
        type: 'select',
        options: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Other'],
        required: true
      }
    ]
  }
]

export function ComplianceForm() {
  const { toneMode, privacyMode } = useTheme()
  const [selectedScenario, setSelectedScenario] = useState<ComplianceScenario | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ComplianceResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScenarioSelect = (scenario: ComplianceScenario) => {
    setSelectedScenario(scenario)
    setFormData({})
    setResult(null)
    setError(null)
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedScenario) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await apiService.checkCompliance(selectedScenario.id, formData, {
        privacy: privacyMode,
        tone: toneMode
      })
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compliance check failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-amber-600 bg-amber-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const isFormValid = selectedScenario?.fields.every(field => 
    !field.required || formData[field.id]?.trim()
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12"
      id="compliance"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {toneMode === 'casual' ? '🛡️ Compliance Checker' : 'Compliance Scenarios'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {toneMode === 'casual' 
              ? 'Quick compliance check for common business scenarios! 🚀'
              : 'Get compliance guidance for common business scenarios with personalized recommendations.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scenario Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {toneMode === 'casual' ? 'Choose a scenario 📋' : 'Select Compliance Scenario'}
            </h3>
            
            {scenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleScenarioSelect(scenario)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedScenario?.id === scenario.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Form or Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            {!selectedScenario ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {toneMode === 'casual' 
                    ? 'Select a scenario to get started! 👆'
                    : 'Please select a compliance scenario to begin'
                  }
                </p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {toneMode === 'casual' ? '📊 Results' : 'Compliance Analysis'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.overallRisk)}`}>
                    {result.overallRisk.toUpperCase()} RISK
                  </span>
                </div>

                {result.flags.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      {toneMode === 'casual' ? '🚨 Issues Found' : 'Compliance Issues'}
                    </h4>
                    {result.flags.map((flag, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(flag.severity)}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{flag.issue}</h5>
                            <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                            <p className="text-sm text-primary-600 mt-2 font-medium">
                              💡 {flag.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.nextSteps.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">
                      {toneMode === 'casual' ? '📝 Next Steps' : 'Recommended Actions'}
                    </h4>
                    <ul className="space-y-2">
                      {result.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => {
                    setResult(null)
                    setFormData({})
                  }}
                  className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {toneMode === 'casual' ? 'Run Another Check 🔄' : 'Run Another Check'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedScenario.name}
                  </h3>
                </div>

                {selectedScenario.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required={field.required}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {toneMode === 'casual' ? 'Checking... 🔍' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      {toneMode === 'casual' ? 'Check Compliance 🚀' : 'Check Compliance'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
