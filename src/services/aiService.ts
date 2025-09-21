// AI Service - Easy to plug in your local LLM
export interface AIResponse {
  content: string;
  timestamp: Date;
}

export interface AIService {
  sendMessage: (message: string) => Promise<AIResponse>;
}

// Default mock AI service - replace this with your local LLM integration
class MockAIService implements AIService {
  async sendMessage(message: string): Promise<AIResponse> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      content: `Based on your query, here's my analysis:

**Summary:** This appears to be a legal clause that requires careful consideration. 

**Key Points:**
- The clause establishes specific obligations and rights
- There may be compliance requirements under Indian law
- Consider the enforceability aspects

**Scenarios to Consider:**
1. **Compliance Scenario:** Ensure adherence to applicable regulations
2. **Risk Assessment:** Evaluate potential liabilities
3. **Implementation:** Consider practical aspects of enforcement

⚠️ **Important Disclaimer:** This is an educational summary only and does not constitute legal advice. Please consult with a qualified legal professional for specific legal guidance.`,
      timestamp: new Date()
    };
  }
}

// Local LLM Service - implement this with your finetuned model
class LocalLLMService implements AIService {
  private apiEndpoint: string;
  
  constructor(apiEndpoint: string = 'http://localhost:8000/api/chat') {
    this.apiEndpoint = apiEndpoint;
  }
  
  async sendMessage(message: string): Promise<AIResponse> {
    try {
      // Replace this with your actual local LLM API call
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: 'legal_assistant_indian_law',
          max_tokens: 1000,
          temperature: 0.3
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        content: data.response || data.content || 'No response received',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Local LLM API error:', error);
      // Fallback to mock service
      const mockService = new MockAIService();
      return mockService.sendMessage(message);
    }
  }
}

// Configuration - easily switch between AI services
const AI_CONFIG = {
  // Set to 'local' to use your local LLM, 'mock' for testing
  provider: 'mock' as 'mock' | 'local',
  localApiEndpoint: 'http://localhost:8000/api/chat'
};

// Factory function to get the appropriate AI service
export function createAIService(): AIService {
  switch (AI_CONFIG.provider) {
    case 'local':
      return new LocalLLMService(AI_CONFIG.localApiEndpoint);
    case 'mock':
    default:
      return new MockAIService();
  }
}

// Export for easy configuration
export { AI_CONFIG };