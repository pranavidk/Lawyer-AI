import { motion } from "framer-motion";
import { useState } from "react";
import { UploadCloud, FileText, X, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { ragAgent, DocumentAnalysis } from "../lib/rag_service";

const DocumentUploadSample = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ phase: string; message: string; percent?: number } | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setProgress({ phase: 'reading', message: 'Initializing...', percent: 0 });
    
    try {
      // Use RAG agent to analyze the document
      const ragAnalysis = await ragAgent.analyzeDocument(
        file,
        (u) => setProgress({ phase: u.phase, message: u.message, percent: u.percent }),
        { timeoutMs: 120000, topK: 6 }
      );
      setAnalysis(ragAnalysis);
    } catch (err) {
      console.error('Document analysis failed:', err);
      setError('Failed to analyze document. Please make sure Ollama is running and try again.');
    } finally {
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysis(null);
    setIsAnalyzing(false);
    setError(null);
    setProgress(null);
  };

  return (
    <motion.section
      className="py-16 bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-dark-text sm:text-4xl mb-4">
            Document Analysis Preview
          </h2>
          <p className="text-lg text-muted-foreground">
            See how JuriSense analyzes your legal documents
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg bg-card p-8 shadow-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {!uploadedFile ? (
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-colors hover:border-accent-blue hover:bg-blue-50/50"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-dark-text mb-2">
                Upload a Document
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your PDF, DOCX, or TXT file here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-blue hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-dark-text">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-blue-200 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-blue-600" />
                </button>
              </div>

              {isAnalyzing ? (
                <div className="text-center py-8">
                  <motion.div
                    className="inline-block h-8 w-8 rounded-full border-4 border-accent-blue border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="mt-4 text-muted-foreground">
                    <p className="font-medium">
                      {progress?.message || 'Analyzing document with RAG agent...'}
                    </p>
                    {typeof progress?.percent === 'number' && (
                      <div className="mt-2 w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-accent-blue h-2 rounded"
                          style={{ width: `${Math.max(0, Math.min(100, progress.percent))}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : error ? (
                <motion.div
                  className="p-6 bg-red-50 rounded-lg border border-red-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-800">Analysis Failed</h4>
                  </div>
                  <p className="text-red-700">{error}</p>
                </motion.div>
              ) : analysis ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Summary Section */}
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800">Document Summary</h4>
                    </div>
                    <p className="text-blue-700 whitespace-pre-line">{analysis.summary}</p>
                  </div>

                  {/* Key Terms Section */}
                  <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-800">Key Legal Terms Explained</h4>
                    </div>
                    <div className="space-y-3">
                      {analysis.keyTerms.map((term, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{term.term}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              term.importance === 'high' ? 'bg-red-100 text-red-800' :
                              term.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {term.importance} priority
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Clauses Section */}
                  <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <h4 className="font-semibold text-yellow-800">Important Clauses</h4>
                    </div>
                    <div className="space-y-3">
                      {analysis.clauses.map((clause, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{clause.title}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              clause.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                              clause.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {clause.riskLevel} risk
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{clause.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-800">Recommendations</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2 mt-1">•</span>
                          <span className="text-purple-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : null}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DocumentUploadSample;