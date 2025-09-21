import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface AnalysisResult {
  originalText: string;
  explanation: string;
  clauseType: string;
  riskLevel: "low" | "medium" | "high";
}

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        originalText: "The Party of the First Part agrees to indemnify and hold harmless the Party of the Second Part from and against any and all claims, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or resulting from the performance of this Agreement.",
        explanation: "This is an indemnification clause. In simple terms: If someone sues or makes a claim because of this agreement, Party #1 promises to pay for Party #2's legal costs and any damages. This protects Party #2 from financial responsibility for problems that might arise from the agreement.",
        clauseType: "Indemnification Clause",
        riskLevel: "medium"
      });
    }, 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "medium": return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "high": return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Document Analysis</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Upload legal documents and get instant plain-English explanations of complex clauses
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive
                    ? "border-secondary bg-secondary/10"
                    : "border-border hover:border-secondary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <UploadIcon className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Drag and drop your document here
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Supports PDF, DOCX, and TXT files up to 10MB
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleChange}
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {isAnalyzing && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing {fileName}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Text */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Original Clause</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-mono leading-relaxed">
                      {analysisResult.originalText}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Type: {analysisResult.clauseType}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(analysisResult.riskLevel)}
                      <span className={`text-sm font-medium ${getRiskColor(analysisResult.riskLevel)}`}>
                        {analysisResult.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plain English Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <span>Plain English Explanation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">
                      {analysisResult.explanation}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      Get More Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sample Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Try Sample Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Non-Disclosure Agreement", type: "NDA" },
                  { name: "Service Agreement", type: "Contract" },
                  { name: "Employment Contract", type: "Employment" },
                ].map((doc, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-4 h-auto flex flex-col items-center space-y-2"
                    onClick={() => handleFile(new File([""], `sample-${doc.name.toLowerCase().replace(/\s+/g, '-')}.pdf`))}
                  >
                    <FileText className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.type}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;