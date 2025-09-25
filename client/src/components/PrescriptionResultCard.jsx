import React from 'react';
import PropTypes from 'prop-types';

const PrescriptionResultCard = ({ analysis }) => {
  if (!analysis) return null;

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '🚨';
      case 'moderate':
        return '⚠️';
      case 'low':
        return '⚡';
      default:
        return '⚡';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'moderate':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-blue-500 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          📊 Analysis Results
        </h2>
        <div className="text-sm text-gray-500">
          {analysis.uploaded_at && new Date(analysis.uploaded_at).toLocaleString()}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          analysis.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : analysis.status === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {analysis.status === 'completed' && '✅ '}
          {analysis.status === 'error' && '❌ '}
          {analysis.status === 'processing' && '⏳ '}
          {analysis.status?.charAt(0).toUpperCase() + analysis.status?.slice(1)}
        </span>
      </div>

      {/* Error State */}
      {analysis.status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Analysis Failed</h3>
          {analysis.warnings?.map((warning, index) => (
            <p key={index} className="text-red-700">{warning}</p>
          ))}
          {analysis.recommendations?.map((rec, index) => (
            <p key={index} className="text-red-600 mt-1">{rec}</p>
          ))}
        </div>
      )}

      {/* Success State */}
      {analysis.status === 'completed' && (
        <>
          {/* Medicines Section */}
          {analysis.medicines && analysis.medicines.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                💊 Detected Medicines ({analysis.medicines.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analysis.medicines.map((medicine, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h4 className="font-semibold text-gray-900 text-lg">{medicine.name}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dosage:</span> {medicine.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span> {medicine.frequency}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Confidence: {Math.round(medicine.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ No Medicines Detected</h3>
              <p className="text-yellow-700">
                No medicines were detected in the prescription. Please ensure the image is clear and contains readable text.
              </p>
            </div>
          )}

          {/* Drug Interactions Section */}
          {analysis.interactions && analysis.interactions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                ⚠️ Drug Interactions Found ({analysis.interactions.length})
              </h3>
              <div className="space-y-3">
                {analysis.interactions.map((interaction, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${getSeverityColor(interaction.severity)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg">
                        {getSeverityIcon(interaction.severity)} {interaction.drug1} + {interaction.drug2}
                      </span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                        interaction.severity === 'high'
                          ? 'bg-red-200 text-red-900'
                          : interaction.severity === 'moderate'
                          ? 'bg-yellow-200 text-yellow-900'
                          : 'bg-blue-200 text-blue-900'
                      }`}>
                        {interaction.severity}
                      </span>
                    </div>
                    <p className="text-sm">{interaction.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings Section */}
          {analysis.warnings && analysis.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                ⚠️ Important Warnings
              </h3>
              <div className="space-y-2">
                {analysis.warnings.map((warning, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                💡 Recommendations
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Text Section (Collapsible) */}
          {analysis.raw_text && (
            <details className="mb-6">
              <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900">
                📄 Extracted Text (Click to view)
              </summary>
              <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                  {analysis.raw_text}
                </pre>
              </div>
            </details>
          )}
        </>
      )}

      {/* Medical Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Medical Disclaimer</h4>
            <p className="mt-1 text-sm text-yellow-700">
              This analysis is for informational purposes only and should not replace professional medical advice. 
              Always consult with your healthcare provider or pharmacist before making any changes to your medication regimen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PrescriptionResultCard.propTypes = {
  analysis: PropTypes.shape({
    uploaded_at: PropTypes.string,
    status: PropTypes.string,
    warnings: PropTypes.arrayOf(PropTypes.string),
    recommendations: PropTypes.arrayOf(PropTypes.string),
    medicines: PropTypes.arrayOf(PropTypes.object),
    interactions: PropTypes.arrayOf(PropTypes.object),
    raw_text: PropTypes.string
  })
};

export default PrescriptionResultCard;