// API Service Layer for Lawyer AI Frontend
// Handles both real backend calls and mock data for development

interface ApiOptions {
  privacy: 'local' | 'cloud'
  tone: 'formal' | 'casual'
}

interface UploadResponse {
  fileId: string
  fileName: string
  fileSize: number
  uploadTime: string
}

interface Clause {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  explanation: string
  originalText: string
  suggestions?: string[]
}

interface ContractAnalysis {
  fileId: string
  fileName: string
  analysisTime: string
  clauses: Clause[]
  summary: string
  overallRisk: 'low' | 'medium' | 'high'
}

interface TermExplanation {
  term: string
  definition: string
  summary: string
  example: string
  statutoryReferences: string[]
}

interface ComplianceFlag {
  severity: 'low' | 'medium' | 'high'
  issue: string
  description: string
  recommendation: string
}

interface ComplianceResult {
  scenario: string
  flags: ComplianceFlag[]
  nextSteps: string[]
  overallRisk: 'low' | 'medium' | 'high'
}

interface ChatResponse {
  message: string
  timestamp: string
}

class ApiService {
  private baseUrl: string
  private isMockMode: boolean

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.isMockMode = process.env.NEXT_PUBLIC_DEV_MODE === 'mock'
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    mockData: () => T
  ): Promise<T> {
    if (this.isMockMode) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      return mockData()
    }

    const url = `${this.baseUrl}/api${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async uploadFile(file: File, options: ApiOptions): Promise<UploadResponse> {
    if (this.isMockMode) {
      return this.makeRequest('/upload', {}, () => ({
        fileId: `mock_${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
      }))
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('privacy', options.privacy)
    formData.append('tone', options.tone)

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async analyzeContract(fileId: string, options: ApiOptions): Promise<ContractAnalysis> {
    return this.makeRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        privacy: options.privacy,
        tone: options.tone,
      }),
    }, () => this.getMockContractAnalysis(options.tone))
  }

  async explainTerm(term: string, options: ApiOptions): Promise<TermExplanation> {
    return this.makeRequest('/explain', {
      method: 'POST',
      body: JSON.stringify({
        term,
        privacy: options.privacy,
        tone: options.tone,
      }),
    }, () => this.getMockTermExplanation(term, options.tone))
  }

  async checkCompliance(
    scenario: string,
    formData: Record<string, string>,
    options: ApiOptions
  ): Promise<ComplianceResult> {
    return this.makeRequest('/compliance', {
      method: 'POST',
      body: JSON.stringify({
        scenario,
        formData,
        privacy: options.privacy,
        tone: options.tone,
      }),
    }, () => this.getMockComplianceResult(scenario, formData, options.tone))
  }

  async chatMessage(
    message: string,
    options: ApiOptions & { chatHistory?: any[] }
  ): Promise<ChatResponse> {
    return this.makeRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        chatHistory: options.chatHistory || [],
        privacy: options.privacy,
        tone: options.tone,
      }),
    }, () => this.getMockChatResponse(message, options.tone))
  }

  // Mock Data Generators
  private getMockContractAnalysis(tone: 'formal' | 'casual'): ContractAnalysis {
    const clauses: Clause[] = [
      {
        id: '1',
        title: 'Liability Limitation Clause',
        severity: 'high',
        explanation: tone === 'casual' 
          ? 'This clause tries to limit the company\'s responsibility if something goes wrong. It\'s pretty broad and might not hold up in court! 😬'
          : 'This clause attempts to limit the company\'s liability for damages. The language is overly broad and may be unenforceable under Indian contract law.',
        originalText: 'The Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.',
        suggestions: tone === 'casual' 
          ? ['Consider making it more specific', 'Add exceptions for gross negligence', 'Review with a lawyer!']
          : ['Specify the types of damages excluded', 'Include exceptions for gross negligence', 'Ensure compliance with Indian Contract Act']
      },
      {
        id: '2',
        title: 'Force Majeure Provision',
        severity: 'medium',
        explanation: tone === 'casual'
          ? 'This covers what happens when things go wrong due to events beyond anyone\'s control. Pretty standard but could be clearer! 🤔'
          : 'This provision addresses circumstances beyond the parties\' control. While standard, the definition could be more comprehensive.',
        originalText: 'Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control.',
        suggestions: tone === 'casual'
          ? ['List specific events (pandemics, natural disasters)', 'Define what "reasonable control" means']
          : ['Enumerate specific force majeure events', 'Define the scope of "reasonable control"', 'Include notice requirements']
      },
      {
        id: '3',
        title: 'Termination Clause',
        severity: 'low',
        explanation: tone === 'casual'
          ? 'This explains how either party can end the contract. Looks pretty fair! 👍'
          : 'This clause outlines the conditions for contract termination. The terms appear reasonable and balanced.',
        originalText: 'Either party may terminate this agreement with 30 days written notice.',
        suggestions: []
      }
    ]

    return {
      fileId: 'mock_contract_123',
      fileName: 'Sample Contract.pdf',
      analysisTime: new Date().toISOString(),
      clauses,
      summary: tone === 'casual'
        ? 'Found 3 clauses to review. One high-risk liability clause needs attention! 🚨'
        : 'Analysis complete. Identified 3 clauses requiring review, including one high-risk liability limitation clause.',
      overallRisk: 'medium'
    }
  }

  private getMockTermExplanation(term: string, tone: 'formal' | 'casual'): TermExplanation {
    const explanations: Record<string, TermExplanation> = {
      'indemnity': {
        term: 'Indemnity',
        definition: tone === 'casual'
          ? 'Basically, it\'s when one person promises to pay for any losses or damages that another person might face. Like insurance, but in legal terms! 🛡️'
          : 'A contractual obligation where one party agrees to compensate another party for any losses, damages, or liabilities that may arise from specified circumstances.',
        summary: tone === 'casual'
          ? 'Indemnity = "I\'ll pay if something goes wrong" 💰'
          : 'Indemnity is a promise to compensate for losses or damages.',
        example: tone === 'casual'
          ? 'In a software contract, the developer might indemnify the client against any copyright issues. So if someone sues the client for using the software, the developer pays! 💻'
          : 'In a software development agreement, the developer may indemnify the client against third-party intellectual property claims arising from the software\'s use.',
        statutoryReferences: [
          'Section 124 of the Indian Contract Act, 1872',
          'Section 125 of the Indian Contract Act, 1872'
        ]
      },
      'force majeure': {
        term: 'Force Majeure',
        definition: tone === 'casual'
          ? 'It\'s like the "act of God" clause! When something totally unexpected happens (like a pandemic or earthquake) that makes it impossible to fulfill a contract. 🌪️'
          : 'A contractual provision that excuses a party from performing its obligations when circumstances beyond their control make performance impossible or impracticable.',
        summary: tone === 'casual'
          ? 'Force Majeure = "Sorry, can\'t do it because of [unexpected disaster]" 🚫'
          : 'Force Majeure excuses contract performance due to unforeseeable circumstances.',
        example: tone === 'casual'
          ? 'During COVID-19, many companies used force majeure clauses to delay deliveries because of lockdowns. The pandemic was totally unexpected! 😷'
          : 'During the COVID-19 pandemic, many Indian companies invoked force majeure clauses to suspend contractual obligations due to government-imposed lockdowns.',
        statutoryReferences: [
          'Section 56 of the Indian Contract Act, 1872 (Frustration of Contract)',
          'Force Majeure Guidelines by Ministry of Finance, 2020'
        ]
      },
      'arbitration': {
        term: 'Arbitration',
        definition: tone === 'casual'
          ? 'Instead of going to court, you solve disputes with a neutral third party (arbitrator). It\'s usually faster and cheaper than regular court battles! ⚖️'
          : 'A method of dispute resolution where parties agree to submit their disputes to a neutral third party (arbitrator) instead of going to court.',
        summary: tone === 'casual'
          ? 'Arbitration = "Let\'s solve this outside court" 🤝'
          : 'Arbitration is an alternative dispute resolution mechanism outside traditional courts.',
        example: tone === 'casual'
          ? 'If you and your business partner disagree about contract terms, you can choose an arbitrator to decide instead of spending years in court! 🏛️'
          : 'Commercial disputes between Indian companies often use arbitration under the Arbitration and Conciliation Act, 2015 for faster resolution.',
        statutoryReferences: [
          'Arbitration and Conciliation Act, 2015',
          'Section 7 of the Arbitration and Conciliation Act, 2015'
        ]
      }
    }

    return explanations[term.toLowerCase()] || {
      term,
      definition: tone === 'casual'
        ? `Sorry, I don't have a specific explanation for "${term}" yet! But I'm learning! 🤓`
        : `The term "${term}" requires further research. Please consult with a legal professional for accurate information.`,
      summary: tone === 'casual'
        ? `Need more info about "${term}" 📚`
        : `Additional research required for "${term}"`,
      example: tone === 'casual'
        ? 'Try asking about common terms like "indemnity", "force majeure", or "arbitration"! 😊'
        : 'Please consult legal resources or a qualified attorney for detailed information.',
      statutoryReferences: []
    }
  }

  private getMockComplianceResult(
    scenario: string,
    formData: Record<string, string>,
    tone: 'formal' | 'casual'
  ): ComplianceResult {
    const results: Record<string, ComplianceResult> = {
      'gst': {
        scenario: 'GST Compliance',
        flags: [
          {
            severity: 'high',
            issue: 'GST Registration Required',
            description: tone === 'casual'
              ? 'Your turnover suggests you need GST registration! Don\'t get caught without it! 😱'
              : 'Based on your annual turnover, GST registration is mandatory under the GST Act.',
            recommendation: tone === 'casual'
              ? 'Register for GST ASAP! It\'s required for businesses above ₹20 lakhs (₹10 lakhs in some states) 🚀'
              : 'Register for GST immediately. Threshold is ₹20 lakhs (₹10 lakhs in special category states).'
          }
        ],
        nextSteps: tone === 'casual'
          ? [
              'Register for GST online at gst.gov.in',
              'Get your GSTIN number',
              'Start filing monthly/quarterly returns',
              'Keep proper books of accounts! 📚'
            ]
          : [
              'Complete GST registration process',
              'Obtain GSTIN (GST Identification Number)',
              'Establish return filing schedule',
              'Maintain proper accounting records'
            ],
        overallRisk: 'high'
      },
      'it_act': {
        scenario: 'IT Act Compliance',
        flags: [
          {
            severity: 'medium',
            issue: 'Data Localization Requirements',
            description: tone === 'casual'
              ? 'You\'re storing data internationally, which might need some adjustments for Indian law! 🌍'
              : 'International data storage may require compliance with data localization requirements under Indian IT laws.',
            recommendation: tone === 'casual'
              ? 'Consider storing sensitive data in India or get proper consent from users! 🇮🇳'
              : 'Implement data localization for sensitive personal data or ensure explicit user consent for international transfer.'
          }
        ],
        nextSteps: tone === 'casual'
          ? [
              'Review your data storage locations',
              'Update privacy policy',
              'Get user consent for data transfer',
              'Consider local data centers! 🏢'
            ]
          : [
              'Audit current data storage practices',
              'Update privacy policy and terms',
              'Implement user consent mechanisms',
              'Evaluate data localization options'
            ],
        overallRisk: 'medium'
      }
    }

    return results[scenario] || {
      scenario,
      flags: [],
      nextSteps: tone === 'casual'
        ? ['All good! No major issues found! 🎉']
        : ['No significant compliance issues identified.'],
      overallRisk: 'low'
    }
  }

  private getMockChatResponse(message: string, tone: 'formal' | 'casual'): ChatResponse {
    const responses = tone === 'casual' 
      ? [
          'That\'s a great question! Let me help you with that! 😊',
          'I understand your concern. Here\'s what I think... 🤔',
          'Good point! Let me explain this in simple terms... 📚',
          'I\'m here to help! Let\'s break this down... 💡',
          'Interesting question! Here\'s my take on it... 🧠'
        ]
      : [
          'I\'d be happy to assist you with that legal query.',
          'That\'s an important question. Let me provide some guidance.',
          'I understand your concern. Here\'s some relevant information.',
          'Thank you for your question. Let me explain the relevant legal aspects.',
          'That\'s a valid point. Here\'s what you should know.'
        ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      message: `${randomResponse} Based on your question about "${message}", I recommend consulting with a qualified legal professional for specific advice tailored to your situation.`,
      timestamp: new Date().toISOString()
    }
  }
}

export const apiService = new ApiService()
