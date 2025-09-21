// API Configuration for JuriSense AI
// This file contains all API endpoints for easy backend integration

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  
  endpoints: {
    // Document Analysis
    analyzeDocument: '/analyze-document',
    uploadFile: '/upload-file',
    
    // Contract Analysis
    analyzeContract: '/analyze-contract',
    
    // Term Explanation
    explainTerm: '/explain-term',
    searchTerms: '/search-terms',
    
    // Compliance
    checkCompliance: '/check-compliance',
    getComplianceRules: '/compliance-rules',
    
    // Chat Assistant
    chat: '/chat',
    chatHistory: '/chat/history',
    
    // Legal Summaries
    generateSummary: '/generate-summary',
    
    // User Management
    profile: '/profile',
    settings: '/settings',
  }
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`
}

// API request helper with error handling
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint)
  
  try {
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
    
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}
