import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ClauseList } from '@/components/ClauseList'
import { ThemeProvider } from '@/components/ThemeProvider'

const mockClauses = [
  {
    id: '1',
    title: 'Test Clause',
    severity: 'high' as const,
    explanation: 'This is a test explanation',
    originalText: 'This is the original text',
    suggestions: ['Test suggestion']
  },
  {
    id: '2',
    title: 'Another Clause',
    severity: 'low' as const,
    explanation: 'Another explanation',
    originalText: 'Another original text',
    suggestions: []
  }
]

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('ClauseList', () => {
  it('renders clauses correctly', () => {
    renderWithTheme(<ClauseList clauses={mockClauses} />)
    
    expect(screen.getByText('Test Clause')).toBeInTheDocument()
    expect(screen.getByText('Another Clause')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('LOW')).toBeInTheDocument()
  })

  it('shows empty state when no clauses', () => {
    renderWithTheme(<ClauseList clauses={[]} />)
    
    expect(screen.getByText(/No clauses to show yet/i)).toBeInTheDocument()
  })

  it('toggles original text visibility', () => {
    renderWithTheme(<ClauseList clauses={mockClauses} />)
    
    const toggleButton = screen.getByText(/Show original text/i)
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('This is the original text')).toBeInTheDocument()
    expect(screen.getByText(/Hide original text/i)).toBeInTheDocument()
  })

  it('shows suggestions when available', () => {
    renderWithTheme(<ClauseList clauses={mockClauses} />)
    
    expect(screen.getByText('Test suggestion')).toBeInTheDocument()
  })

  it('handles copy functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    })

    renderWithTheme(<ClauseList clauses={mockClauses} />)
    
    const copyButton = screen.getAllByLabelText(/Copy explanation/i)[0]
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('This is a test explanation')
    })
  })
})
