import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ComplianceForm } from '@/components/ComplianceForm'
import { ThemeProvider } from '@/components/ThemeProvider'

// Mock the API service
jest.mock('@/lib/api', () => ({
  apiService: {
    checkCompliance: jest.fn(),
  },
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('ComplianceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders scenario selection', () => {
    renderWithTheme(<ComplianceForm />)
    
    expect(screen.getByText(/Compliance Scenarios/i)).toBeInTheDocument()
    expect(screen.getByText(/GST Compliance/i)).toBeInTheDocument()
    expect(screen.getByText(/IT Act Compliance/i)).toBeInTheDocument()
    expect(screen.getByText(/Employment Law/i)).toBeInTheDocument()
    expect(screen.getByText(/Rental Agreement/i)).toBeInTheDocument()
  })

  it('shows form when scenario is selected', () => {
    renderWithTheme(<ComplianceForm />)
    
    const gstButton = screen.getByText(/GST Compliance/i)
    fireEvent.click(gstButton)
    
    expect(screen.getByText(/Business Type/i)).toBeInTheDocument()
    expect(screen.getByText(/Annual Turnover/i)).toBeInTheDocument()
  })

  it('validates required fields', () => {
    renderWithTheme(<ComplianceForm />)
    
    const gstButton = screen.getByText(/GST Compliance/i)
    fireEvent.click(gstButton)
    
    const submitButton = screen.getByText(/Check Compliance/i)
    expect(submitButton).toBeDisabled()
  })

  it('enables submit when form is valid', () => {
    renderWithTheme(<ComplianceForm />)
    
    const gstButton = screen.getByText(/GST Compliance/i)
    fireEvent.click(gstButton)
    
    // Fill required fields
    const businessTypeSelect = screen.getByDisplayValue(/Select an option/i)
    fireEvent.change(businessTypeSelect, { target: { value: 'Company' } })
    
    const turnoverInput = screen.getByPlaceholderText(/Enter annual turnover/i)
    fireEvent.change(turnoverInput, { target: { value: '5000000' } })
    
    const activitiesTextarea = screen.getByPlaceholderText(/Describe your main business activities/i)
    fireEvent.change(activitiesTextarea, { target: { value: 'Software development' } })
    
    const gstStatusSelect = screen.getByDisplayValue(/Select an option/i)
    fireEvent.change(gstStatusSelect, { target: { value: 'Not Registered' } })
    
    const submitButton = screen.getByText(/Check Compliance/i)
    expect(submitButton).not.toBeDisabled()
  })

  it('submits form and shows results', async () => {
    const { apiService } = require('@/lib/api')
    const mockResult = {
      scenario: 'GST Compliance',
      flags: [
        {
          severity: 'high',
          issue: 'GST Registration Required',
          description: 'Test description',
          recommendation: 'Test recommendation'
        }
      ],
      nextSteps: ['Step 1', 'Step 2'],
      overallRisk: 'high'
    }
    
    apiService.checkCompliance.mockResolvedValue(mockResult)

    renderWithTheme(<ComplianceForm />)
    
    const gstButton = screen.getByText(/GST Compliance/i)
    fireEvent.click(gstButton)
    
    // Fill form
    const businessTypeSelect = screen.getByDisplayValue(/Select an option/i)
    fireEvent.change(businessTypeSelect, { target: { value: 'Company' } })
    
    const turnoverInput = screen.getByPlaceholderText(/Enter annual turnover/i)
    fireEvent.change(turnoverInput, { target: { value: '5000000' } })
    
    const activitiesTextarea = screen.getByPlaceholderText(/Describe your main business activities/i)
    fireEvent.change(activitiesTextarea, { target: { value: 'Software development' } })
    
    const gstStatusSelect = screen.getByDisplayValue(/Select an option/i)
    fireEvent.change(gstStatusSelect, { target: { value: 'Not Registered' } })
    
    const submitButton = screen.getByText(/Check Compliance/i)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(apiService.checkCompliance).toHaveBeenCalledWith('gst', expect.any(Object), expect.any(Object))
    })
    
    await waitFor(() => {
      expect(screen.getByText(/Compliance Analysis/i)).toBeInTheDocument()
      expect(screen.getByText('GST Registration Required')).toBeInTheDocument()
    })
  })

  it('shows error state when submission fails', async () => {
    const { apiService } = require('@/lib/api')
    apiService.checkCompliance.mockRejectedValue(new Error('Compliance check failed'))

    renderWithTheme(<ComplianceForm />)
    
    const gstButton = screen.getByText(/GST Compliance/i)
    fireEvent.click(gstButton)
    
    // Fill form
    const businessTypeSelect = screen.getByDisplayValue(/Select an option/i)
    fireEvent.change(businessTypeSelect, { target: { value: 'Company' } })
    
    const turnoverInput = screen.getByPlaceholderText(/Enter annual turnover/i)
    fireEvent.change(turnoverInput, { target: { value: '5000000' } })
    
    const activitiesTextarea = screen.getByPlaceholderText(/Describe your main business activities/i)
    fireEvent.change(activitiesTextarea, { target: { value: 'Software development' } })
    
    const gstStatusSelect = screen.getByDisplayValue(/Select an option/i)
    fireEvent.change(gstStatusSelect, { target: { value: 'Not Registered' } })
    
    const submitButton = screen.getByText(/Check Compliance/i)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Compliance check failed/i)).toBeInTheDocument()
    })
  })
})
