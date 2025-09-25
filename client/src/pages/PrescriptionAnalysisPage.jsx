import React, { useState, useRef } from "react";
import { analyzePrescription, validatePrescriptionFile, formatFileSize } from "../api/prescription";

export default function PrescriptionAnalysisPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    setError("");
    setResult(null);
    
    if (selectedFile) {
      const validation = validatePrescriptionFile(selectedFile);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await analyzePrescription(file);
      setResult(response.analysis);
    } catch (err) {
      setError(err.message || "Failed to analyze prescription");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Prescription Analyzer</h1>
          <p className="text-gray-600">Upload your prescription image or PDF to analyze medicines and check for drug interactions</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-blue-400 bg-blue-50" 
                : file 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-2">✓</div>
                <p className="text-lg font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</p>
                <button 
                  onClick={resetForm}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-4">📎</div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your prescription here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: JPEG, PNG, GIF, PDF (Max 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {file && !error && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isLoading ? "Analyzing..." : "Analyze Prescription"}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Analysis Results</h2>
            
            {/* Medicines Section */}
            {result.medicines && result.medicines.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">💊 Detected Medicines</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {result.medicines.map((medicine, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Dosage:</span> {medicine.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span> {medicine.frequency}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Confidence: {Math.round(medicine.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                No medicines were detected in the prescription. Please ensure the image is clear and contains readable text.
              </div>
            )}

            {/* Interactions Section */}
            {result.interactions && result.interactions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Drug Interactions Found</h3>
                <div className="space-y-3">
                  {result.interactions.map((interaction, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${
                        interaction.severity === "high" 
                          ? "border-red-500 bg-red-50" 
                          : interaction.severity === "moderate"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {interaction.drug1} + {interaction.drug2}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          interaction.severity === "high"
                            ? "bg-red-200 text-red-800"
                            : interaction.severity === "moderate"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-blue-200 text-blue-800"
                        }`}>
                          {interaction.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings Section */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Warnings</h3>
                <div className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-green-600 mb-4">💡 Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Medical Disclaimer</h4>
              <p className="text-sm text-yellow-700">
                This analysis is for informational purposes only and should not replace professional medical advice. 
                Always consult with your healthcare provider or pharmacist before making any changes to your medication regimen.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Analyze Another Prescription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
