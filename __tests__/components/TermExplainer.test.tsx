import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TermExplainer } from '@/components/TermExplainer'
import { ThemeProvider } from '@/components/ThemeProvider'

// Mock the API service
jest.mock('@/lib/api', () => ({
  apiService: {
    explainTerm: jest.fn(),
  },
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('TermExplainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search interface correctly', () => {
    renderWithTheme(<TermExplainer />)
    
    expect(screen.getByText(/Legal Term Explanation/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter legal term/i)).toBeInTheDocument()
  })

  it('handles term search', async () => {
    const { apiService } = require('@/lib/api')
    const mockExplanation = {
      term: 'indemnity',
      definition: 'Test definition',
      summary: 'Test summary',
      example: 'Test example',
      statutoryReferences: ['Test reference']
    }
    
    apiService.explainTerm.mockResolvedValue(mockExplanation)

    renderWithTheme(<TermExplainer />)
    
    const input = screen.getByPlaceholderText(/Enter legal term/i)
    const searchButton = screen.getByRole('button', { name: /search/i })
    
    fireEvent.change(input, { target: { value: 'indemnity' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(apiService.explainTerm).toHaveBeenCalledWith('indemnity', expect.any(Object))
    })
  })

  it('shows loading state during search', async () => {
    const { apiService } = require('@/lib/api')
    apiService.explainTerm.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        term: 'test',
        definition: 'test',
        summary: 'test',
        example: 'test',
        statutoryReferences: []
      }), 100))
    )

    renderWithTheme(<TermExplainer />)
    
    const input = screen.getByPlaceholderText(/Enter legal term/i)
    const searchButton = screen.getByRole('button', { name: /search/i })
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(searchButton)
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  it('shows error state when search fails', async () => {
    const { apiService } = require('@/lib/api')
    apiService.explainTerm.mockRejectedValue(new Error('Search failed'))

    renderWithTheme(<TermExplainer />)
    
    const input = screen.getByPlaceholderText(/Enter legal term/i)
    const searchButton = screen.getByRole('button', { name: /search/i })
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Search failed/i)).toBeInTheDocument()
    })
  })

  it('displays explanation results', async () => {
    const { apiService } = require('@/lib/api')
    const mockExplanation = {
      term: 'indemnity',
      definition: 'Test definition',
      summary: 'Test summary',
      example: 'Test example',
      statutoryReferences: ['Test reference']
    }
    
    apiService.explainTerm.mockResolvedValue(mockExplanation)

    renderWithTheme(<TermExplainer />)
    
    const input = screen.getByPlaceholderText(/Enter legal term/i)
    const searchButton = screen.getByRole('button', { name: /search/i })
    
    fireEvent.change(input, { target: { value: 'indemnity' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('indemnity')).toBeInTheDocument()
      expect(screen.getByText('Test definition')).toBeInTheDocument()
      expect(screen.getByText('Test summary')).toBeInTheDocument()
      expect(screen.getByText('Test example')).toBeInTheDocument()
      expect(screen.getByText('Test reference')).toBeInTheDocument()
    })
  })
})
