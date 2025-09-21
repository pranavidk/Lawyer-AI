import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatWidget } from '@/components/ChatWidget'
import { ThemeProvider } from '@/components/ThemeProvider'

// Mock the API service
jest.mock('@/lib/api', () => ({
  apiService: {
    chatMessage: jest.fn(),
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('ChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders chat button when closed', () => {
    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    expect(chatButton).toBeInTheDocument()
  })

  it('opens chat when button is clicked', () => {
    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    expect(screen.getByText(/Legal Assistant/i)).toBeInTheDocument()
  })

  it('shows welcome message when no messages', () => {
    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    expect(screen.getByText(/Hi! I'm your legal assistant/i)).toBeInTheDocument()
  })

  it('sends message and shows response', async () => {
    const { apiService } = require('@/lib/api')
    apiService.chatMessage.mockResolvedValue({
      message: 'Test response',
      timestamp: new Date().toISOString()
    })

    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me anything/i)
    const sendButton = screen.getByLabelText(/Send message/i)
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(apiService.chatMessage).toHaveBeenCalledWith('Test message', expect.any(Object))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument()
    })
  })

  it('shows loading state while waiting for response', async () => {
    const { apiService } = require('@/lib/api')
    apiService.chatMessage.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        message: 'Test response',
        timestamp: new Date().toISOString()
      }), 100))
    )

    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me anything/i)
    const sendButton = screen.getByLabelText(/Send message/i)
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
    // Loading indicator should be present
    expect(screen.getByRole('button', { name: /Send message/i })).toBeDisabled()
  })

  it('handles chat errors gracefully', async () => {
    const { apiService } = require('@/lib/api')
    apiService.chatMessage.mockRejectedValue(new Error('Chat error'))

    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me anything/i)
    const sendButton = screen.getByLabelText(/Send message/i)
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument()
    })
  })

  it('closes chat when close button is clicked', () => {
    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    expect(screen.getByText(/Legal Assistant/i)).toBeInTheDocument()
    
    const closeButton = screen.getByLabelText(/Close chat/i)
    fireEvent.click(closeButton)
    
    expect(screen.queryByText(/Legal Assistant/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Open chat/i)).toBeInTheDocument()
  })

  it('minimizes and expands chat', () => {
    renderWithTheme(<ChatWidget />)
    
    const chatButton = screen.getByLabelText(/Open chat/i)
    fireEvent.click(chatButton)
    
    const minimizeButton = screen.getByLabelText(/Minimize chat/i)
    fireEvent.click(minimizeButton)
    
    // Chat should still be open but minimized
    expect(screen.getByText(/Legal Assistant/i)).toBeInTheDocument()
    
    const expandButton = screen.getByLabelText(/Expand chat/i)
    fireEvent.click(expandButton)
    
    expect(screen.getByPlaceholderText(/Ask me anything/i)).toBeInTheDocument()
  })
})
