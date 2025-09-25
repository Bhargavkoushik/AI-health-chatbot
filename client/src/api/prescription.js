import axios from "axios";

// Base URL for the API - adjust this based on your backend configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
  // Do not set 'Content-Type' manually for FormData; let the browser set proper boundaries
});

/**
 * Analyze a prescription image or PDF
 * @param {File} file - The prescription image or PDF file
 * @returns {Promise<Object>} Analysis results
 */
export const analyzePrescription = async (file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload an image (JPEG, PNG, GIF) or PDF.");
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Make API request
    const response = await api.post("/api/prescription/analyze", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.detail || "Server error occurred";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Network error
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      // Other errors
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Check the health of the prescription analysis service
 * @returns {Promise<Object>} Health status
 */
export const checkPrescriptionServiceHealth = async () => {
  try {
    const response = await api.get("/api/prescription/health");
    return response.data;
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
};

/**
 * Helper function to validate file before upload
 * @param {File} file - The file to validate
 * @returns {Object} Validation result
 */
export const validatePrescriptionFile = (file) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (!file) {
    result.isValid = false;
    result.errors.push("No file selected");
    return result;
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    result.isValid = false;
    result.errors.push("Invalid file type. Please upload an image (JPEG, PNG, GIF) or PDF.");
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    result.isValid = false;
    result.errors.push("File size too large. Maximum size is 5MB.");
  }

  // Check if file is empty
  if (file.size === 0) {
    result.isValid = false;
    result.errors.push("File is empty.");
  }

  return result;
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  analyzePrescription,
  checkPrescriptionServiceHealth,
  validatePrescriptionFile,
  formatFileSize
};
