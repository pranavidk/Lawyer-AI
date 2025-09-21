import { apiService } from '@/lib/api'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
})

afterEach(() => {
  process.env = originalEnv
})

describe('ApiService', () => {
  describe('Mock Mode', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_MODE = 'mock'
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
    })

    it('uses mock data when in mock mode', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const result = await apiService.uploadFile(file, { privacy: 'local', tone: 'formal' })
      
      expect(result).toHaveProperty('fileId')
      expect(result).toHaveProperty('fileName', 'test.pdf')
      expect(result).toHaveProperty('fileSize', file.size)
    })

    it('returns mock contract analysis', async () => {
      const result = await apiService.analyzeContract('test-123', { privacy: 'local', tone: 'formal' })
      
      expect(result).toHaveProperty('clauses')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('overallRisk')
      expect(Array.isArray(result.clauses)).toBe(true)
    })

    it('returns mock term explanation', async () => {
      const result = await apiService.explainTerm('indemnity', { privacy: 'local', tone: 'formal' })
      
      expect(result).toHaveProperty('term', 'indemnity')
      expect(result).toHaveProperty('definition')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('example')
      expect(result).toHaveProperty('statutoryReferences')
    })

    it('returns mock compliance result', async () => {
      const formData = { business_type: 'Company', annual_turnover: '5000000' }
      const result = await apiService.checkCompliance('gst', formData, { privacy: 'local', tone: 'formal' })
      
      expect(result).toHaveProperty('scenario', 'GST Compliance')
      expect(result).toHaveProperty('flags')
      expect(result).toHaveProperty('nextSteps')
      expect(result).toHaveProperty('overallRisk')
    })

    it('returns mock chat response', async () => {
      const result = await apiService.chatMessage('Hello', { privacy: 'local', tone: 'formal', chatHistory: [] })
      
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('timestamp')
      expect(typeof result.message).toBe('string')
    })
  })

  describe('Real API Mode', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_MODE = 'development'
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
    })

    it('makes real API calls when not in mock mode', async () => {
      // Mock fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ fileId: 'real-123', fileName: 'test.pdf' })
      })

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      
      // This would normally make a real API call
      // In test environment, we're mocking fetch
      await expect(apiService.uploadFile(file, { privacy: 'local', tone: 'formal' }))
        .resolves.toHaveProperty('fileId')
    })

    it('handles API errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      
      await expect(apiService.uploadFile(file, { privacy: 'local', tone: 'formal' }))
        .rejects.toThrow('API request failed: 500 Internal Server Error')
    })
  })

  describe('Environment Configuration', () => {
    it('uses default API URL when not set', () => {
      delete process.env.NEXT_PUBLIC_API_URL
      const service = new (require('@/lib/api').ApiService)()
      expect(service['baseUrl']).toBe('http://localhost:8000')
    })

    it('uses custom API URL when set', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
      const service = new (require('@/lib/api').ApiService)()
      expect(service['baseUrl']).toBe('https://api.example.com')
    })
  })
})
