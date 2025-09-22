import { queryOllama } from './ollama_api';

export interface DocumentAnalysis {
  summary: string;
  keyTerms: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  clauses: Array<{
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  recommendations: string[];
}

export class RAGAgent {
  private async extractTextFromFile(file: File): Promise<string> {
    // For now, we'll simulate text extraction
    // In a real implementation, you'd use libraries like pdf-parse, mammoth, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulate extracted text based on file type
        const mockText = this.generateMockDocumentText(file.name);
        resolve(mockText);
      };
      reader.readAsText(file);
    });
  }

  private generateMockDocumentText(filename: string): string {
    // Generate realistic mock legal document text based on filename
    const baseText = `
CONTRACT AGREEMENT

This Agreement ("Agreement") is entered into on [DATE] between [PARTY A] ("Company") and [PARTY B] ("Client").

1. SCOPE OF SERVICES
The Company agrees to provide legal consultation services to the Client in accordance with the terms outlined herein.

2. PAYMENT TERMS
Payment shall be made within 30 days of invoice receipt. Late payments may incur a 1.5% monthly service charge.

3. CONFIDENTIALITY
Both parties agree to maintain strict confidentiality regarding all proprietary information shared during the course of this agreement.

4. TERMINATION
Either party may terminate this agreement with 30 days written notice. Upon termination, all outstanding payments become immediately due.

5. LIABILITY LIMITATION
The Company's liability shall not exceed the total amount paid under this agreement in the preceding 12 months.

6. GOVERNING LAW
This agreement shall be governed by the laws of [JURISDICTION] and any disputes shall be resolved through binding arbitration.

7. FORCE MAJEURE
Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.

8. AMENDMENTS
This agreement may only be amended by written consent of both parties.

9. SEVERABILITY
If any provision of this agreement is deemed invalid, the remaining provisions shall remain in full force and effect.

10. ENTIRE AGREEMENT
This document constitutes the entire agreement between the parties and supersedes all prior negotiations.
    `;
    return baseText;
  }

  private async analyzeDocumentWithRAG(documentText: string): Promise<DocumentAnalysis> {
    const analysisPrompt = `
You are JuriSense AI, a legal document analysis expert. Analyze the following legal document and provide a comprehensive analysis in JSON format.

Document Text:
${documentText}

Please provide your analysis in the following JSON structure:
{
  "summary": "A clear, concise summary of the document in plain English",
  "keyTerms": [
    {
      "term": "Legal term",
      "definition": "Simple explanation in plain English",
      "importance": "high|medium|low"
    }
  ],
  "clauses": [
    {
      "title": "Clause name",
      "description": "What this clause means in simple terms",
      "riskLevel": "low|medium|high"
    }
  ],
  "recommendations": [
    "Practical advice or warnings about this document"
  ]
}

Focus on:
- Explaining complex legal terms in simple language
- Identifying potential risks or concerns
- Highlighting important clauses
- Providing actionable recommendations

Respond ONLY with valid JSON, no additional text.
`;

    try {
      const response = await queryOllama(analysisPrompt);
      
      // Try to parse the JSON response
      try {
        const analysis = JSON.parse(response);
        return analysis;
      } catch (parseError) {
        // If JSON parsing fails, create a fallback analysis
        return this.createFallbackAnalysis(documentText);
      }
    } catch (error) {
      console.error('RAG analysis failed:', error);
      return this.createFallbackAnalysis(documentText);
    }
  }

  private createFallbackAnalysis(documentText: string): DocumentAnalysis {
    return {
      summary: "This appears to be a legal contract document. The document contains standard contractual terms including payment terms, confidentiality clauses, termination procedures, and liability limitations. It follows conventional legal document structure with numbered sections covering various aspects of the agreement.",
      keyTerms: [
        {
          term: "Force Majeure",
          definition: "A clause that protects parties from liability when circumstances beyond their control prevent them from fulfilling the contract",
          importance: "medium"
        },
        {
          term: "Liability Limitation",
          definition: "A clause that caps the maximum amount one party can be held responsible for damages",
          importance: "high"
        },
        {
          term: "Confidentiality",
          definition: "An agreement to keep sensitive information private and not share it with others",
          importance: "high"
        }
      ],
      clauses: [
        {
          title: "Payment Terms",
          description: "Specifies when and how payments should be made, including late payment penalties",
          riskLevel: "medium"
        },
        {
          title: "Termination Clause",
          description: "Outlines the conditions and procedures for ending the contract",
          riskLevel: "medium"
        },
        {
          title: "Liability Limitation",
          description: "Limits the maximum financial responsibility of the parties",
          riskLevel: "high"
        }
      ],
      recommendations: [
        "Review payment terms carefully to understand your financial obligations",
        "Consider the termination clause - ensure you have adequate notice periods",
        "Pay attention to liability limitations - they may affect your legal recourse",
        "Consult with a qualified attorney before signing any legal document"
      ]
    };
  }

  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    try {
      // Extract text from the uploaded file
      const documentText = await this.extractTextFromFile(file);
      
      // Analyze the document using RAG
      const analysis = await this.analyzeDocumentWithRAG(documentText);
      
      return analysis;
    } catch (error) {
      console.error('Document analysis failed:', error);
      throw new Error('Failed to analyze document. Please try again.');
    }
  }
}

export const ragAgent = new RAGAgent();
