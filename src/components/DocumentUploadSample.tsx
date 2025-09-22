import { motion } from "framer-motion";
import { useState } from "react";
import { UploadCloud, FileText, X, AlertTriangle, CheckCircle } from "lucide-react";

const DocumentUploadSample = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ summary: string; terms: { term: string; explanation: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ phase: string; message: string; percent?: number } | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setProgress({ phase: 'reading', message: 'Initializing...', percent: 0 });
    
    try {
      // Quick health check to avoid generic Failed to fetch
      try {
        const health = await fetch('http://127.0.0.1:8000/health', { method: 'GET' });
        if (!health.ok) {
          throw new Error('RAG server not reachable. Please start backend.');
        }
      } catch (e) {
        throw new Error('Cannot reach RAG server at http://127.0.0.1:8000. Please start: uvicorn rag_server:app --host 127.0.0.1 --port 8000');
      }

      // Send file to backend RAG server with progress tracking
      const form = new FormData();
      form.append('file', file);
      
      // Simulate progress updates for different phases
      setProgress({ phase: 'reading', message: 'Reading document...', percent: 5 });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress({ phase: 'chunking', message: 'Processing document chunks...', percent: 15 });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setProgress({ phase: 'embedding', message: 'Generating embeddings...', percent: 25 });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setProgress({ phase: 'embedding', message: 'Storing in vector database...', percent: 50 });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setProgress({ phase: 'summarizing', message: 'Generating summary...', percent: 70 });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setProgress({ phase: 'extracting_terms', message: 'Extracting legal terms...', percent: 85 });
      
      const resp = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: form
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || `Server error ${resp.status}`);
      }
      const data = await resp.json();
      setProgress({ phase: 'summarizing', message: 'Analysis complete!', percent: 100 });
      setAnalysis({ summary: data.summary, terms: data.terms || [] });
    } catch (err: any) {
      console.error('Document analysis failed:', err);
      const msg = typeof err?.message === 'string' ? err.message : 'Failed to analyze document.';
      setError(msg);
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
                    <p className="font-medium">{progress?.message || 'Analyzing document with RAG agent...'}</p>
                    {typeof progress?.percent === 'number' ? (
                      <div className="mt-2 w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-accent-blue h-2 rounded"
                          style={{ width: `${Math.max(0, Math.min(100, progress.percent))}%` }}
                        />
                      </div>
                    ) : (
                      <div className="mt-2 w-full bg-gray-200 rounded h-2">
                        <div className="bg-accent-blue h-2 rounded animate-pulse" style={{ width: '40%' }} />
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

                  {/* Key Legal Terms (sorted) */}
                  <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Key Legal Terms</h4>
                    <div className="space-y-3">
                      {analysis.terms.map((t, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="font-medium text-gray-800 mb-1">{t.term}</div>
                          <p className="text-gray-600 text-sm">{t.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Clauses (sorted) */}
                  

                  {/* No Recommendations per requirements */}
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