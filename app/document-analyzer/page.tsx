'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { FileText, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DocumentAnalyzer() {
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

      // Simulate API call to /api/analyze-document
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus('analyzing')

      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 1500))

      setUploadStatus('success')
    } catch (err) {
      setUploadStatus('error')
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }, [])

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
        return <Loader2 className="h-8 w-8 text-aurora-accent1 animate-spin" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />
      default:
        return <Upload className="h-8 w-8 text-aurora-accent1" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading your document... 📤'
      case 'analyzing':
        return 'Analyzing document with AI... 🔍'
      case 'success':
        return 'Analysis complete! 🎉'
      case 'error':
        return 'Upload failed'
      default:
        return 'Drop your document here! 📄'
    }
  }

  return (
    <div className="min-h-screen dark:bg-aurora-primary light:bg-light-primary transition-colors duration-300">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-aurora-accent1 to-aurora-accent2 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-aurora-primary" />
            </div>
            <h1 className="text-4xl font-bold dark:text-aurora-text light:text-light-text mb-4">
              Document Analyzer
            </h1>
            <p className="text-xl dark:text-aurora-text/80 light:text-light-text/80 max-w-2xl mx-auto">
              Upload any legal document and get AI-powered insights, clause analysis, and plain-English explanations
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="dark:bg-aurora-secondary light:bg-white rounded-2xl shadow-lg border dark:border-aurora-accent1/20 light:border-gray-200 p-8"
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
                  <h3 className="text-lg font-medium dark:text-aurora-text light:text-light-text mb-2">
                    {getStatusText()}
                  </h3>
                  
                  {uploadStatus === 'idle' && (
                    <p className="dark:text-aurora-text/70 light:text-light-text/70">
                      Supports PDF, DOCX, and TXT files (up to 10MB)
                    </p>
                  )}

                  {uploadedFile && (
                    <div className="mt-4 p-3 dark:bg-aurora-primary/50 light:bg-gray-50 rounded-lg border dark:border-aurora-accent1/20 light:border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-aurora-accent1" />
                        <span className="text-sm dark:text-aurora-text light:text-light-text">{uploadedFile.name}</span>
                      </div>
                    </div>
                  )}

                  {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
                    <div className="mt-4 w-full max-w-xs mx-auto">
                      <div className="dark:bg-aurora-primary/50 light:bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-aurora-accent1 to-aurora-accent2 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm dark:text-aurora-text/80 light:text-light-text/80 mt-2">
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

            {uploadStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-400/10 border border-green-400/30 rounded-lg"
              >
                <h4 className="font-semibold text-green-300 mb-3">Analysis Results</h4>
                <p className="text-sm text-green-200">
                  Your document has been successfully analyzed! The AI has identified key clauses, 
                  potential issues, and provided plain-English explanations. Results will be displayed 
                  once the backend integration is complete.
                </p>
                <div className="mt-4 flex items-center gap-2 text-green-300">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">Backend integration in progress</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
