'use client'

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { apiService } from '@/lib/api'

interface UploadContractProps {
  onAnalysisComplete: (analysis: any) => void
}

export function UploadContract({ onAnalysisComplete }: UploadContractProps) {
  const { toneMode, privacyMode } = useTheme()
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadedFile(file)
    setError(null)
    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload file
      const uploadResult = await apiService.uploadFile(file, {
        privacy: privacyMode,
        tone: toneMode
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus('analyzing')

      // Analyze contract
      const analysis = await apiService.analyzeContract(uploadResult.fileId, {
        privacy: privacyMode,
        tone: toneMode
      })

      setUploadStatus('success')
      onAnalysisComplete(analysis)
    } catch (err) {
      setUploadStatus('error')
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }, [privacyMode, toneMode, onAnalysisComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'analyzing':
        return <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-600" />
      default:
        return <Upload className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return toneMode === 'casual' ? 'Uploading your file... 📤' : 'Uploading document'
      case 'analyzing':
        return toneMode === 'casual' ? 'Analyzing contract clauses... 🔍' : 'Analyzing contract'
      case 'success':
        return toneMode === 'casual' ? 'Analysis complete! 🎉' : 'Analysis completed successfully'
      case 'error':
        return 'Upload failed'
      default:
        return toneMode === 'casual' ? 'Drop your contract here! 📄' : 'Upload contract document'
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12"
      id="contract"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {toneMode === 'casual' ? '📄 Contract Analysis' : 'Contract Clause Analysis'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {toneMode === 'casual' 
              ? 'Upload your contract and we\'ll highlight important clauses with plain-English explanations! 😊'
              : 'Upload your contract document to analyze clauses, identify potential issues, and receive plain-English explanations.'
            }
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-aurora-secondary rounded-2xl shadow-lg border border-aurora-accent1/20 p-8"
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-aurora-accent1 bg-aurora-accent1/10'
                : uploadStatus === 'error'
                ? 'border-red-400 bg-red-400/10'
                : uploadStatus === 'success'
                ? 'border-green-400 bg-green-400/10'
                : 'border-aurora-accent1/50 hover:border-aurora-accent1 hover:bg-aurora-accent1/5'
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center gap-4">
              {getStatusIcon()}
              
              <div>
                <h3 className="text-lg font-medium text-aurora-text mb-2">
                  {getStatusText()}
                </h3>
                
                {uploadStatus === 'idle' && (
                  <p className="text-aurora-text/70">
                    {toneMode === 'casual' 
                      ? 'Supports PDF, DOCX, and TXT files (up to 10MB)'
                      : 'Supported formats: PDF, DOCX, TXT (Maximum 10MB)'
                    }
                  </p>
                )}

                {uploadedFile && (
                  <div className="mt-4 p-3 bg-aurora-primary/50 rounded-lg border border-aurora-accent1/20">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-aurora-accent1" />
                      <span className="text-sm text-aurora-text">{uploadedFile.name}</span>
                    </div>
                  </div>
                )}

                {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
                  <div className="mt-4 w-full max-w-xs mx-auto">
                    <div className="bg-aurora-primary/50 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-aurora-accent1 to-aurora-accent2 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-aurora-text/80 mt-2">
                      {uploadProgress}% complete
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
