import { motion } from "framer-motion";
import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

const DocumentUploadSample = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis(`Analysis of ${file.name}: This document appears to be a legal contract with standard terms and conditions. Key sections include liability clauses, termination procedures, and payment terms. The document follows conventional legal formatting and contains no unusual provisions.`);
    }, 2000);
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
    setAnalysis("");
    setIsAnalyzing(false);
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
                  <p className="mt-4 text-muted-foreground">Analyzing document...</p>
                </div>
              ) : analysis ? (
                <motion.div
                  className="p-6 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="font-semibold text-green-800 mb-2">Analysis Complete</h4>
                  <p className="text-green-700">{analysis}</p>
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