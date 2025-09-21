import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UploadContract } from '@/components/UploadContract'
import { ThemeProvider } from '@/components/ThemeProvider'

// Mock the API service
jest.mock('@/lib/api', () => ({
  apiService: {
    uploadFile: jest.fn(),
    analyzeContract: jest.fn(),
  },
}))

const mockOnAnalysisComplete = jest.fn()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('UploadContract', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload interface correctly', () => {
    renderWithTheme(<UploadContract onAnalysisComplete={mockOnAnalysisComplete} />)
    
    expect(screen.getByText(/Contract Clause Analysis/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload contract document/i)).toBeInTheDocument()
  })

  it('shows drag and drop area', () => {
    renderWithTheme(<UploadContract onAnalysisComplete={mockOnAnalysisComplete} />)
    
    const dropzone = screen.getByText(/Drop your contract here/i)
    expect(dropzone).toBeInTheDocument()
  })

  it('accepts file upload', async () => {
    const { apiService } = require('@/lib/api')
    apiService.uploadFile.mockResolvedValue({
      fileId: 'test-123',
      fileName: 'test.pdf',
      fileSize: 1024,
      uploadTime: new Date().toISOString(),
    })
    apiService.analyzeContract.mockResolvedValue({
      fileId: 'test-123',
      fileName: 'test.pdf',
      clauses: [],
      summary: 'Test analysis',
      overallRisk: 'low',
    })

    renderWithTheme(<UploadContract onAnalysisComplete={mockOnAnalysisComplete} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/file upload/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(apiService.uploadFile).toHaveBeenCalledWith(file, expect.any(Object))
    })
  })

  it('shows error state when upload fails', async () => {
    const { apiService } = require('@/lib/api')
    apiService.uploadFile.mockRejectedValue(new Error('Upload failed'))

    renderWithTheme(<UploadContract onAnalysisComplete={mockOnAnalysisComplete} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/file upload/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText(/Upload failed/i)).toBeInTheDocument()
    })
  })

  it('shows progress during upload', async () => {
    const { apiService } = require('@/lib/api')
    apiService.uploadFile.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        fileId: 'test-123',
        fileName: 'test.pdf',
        fileSize: 1024,
        uploadTime: new Date().toISOString(),
      }), 100))
    )

    renderWithTheme(<UploadContract onAnalysisComplete={mockOnAnalysisComplete} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/file upload/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(screen.getByText(/Uploading/i)).toBeInTheDocument()
  })
})
