import React, { useState } from 'react';
import { AlertTriangle, Search, Copy, Download } from 'lucide-react';
import { errorTracker } from '../utils/errorTracking';

const ProductionErrorAnalyzer: React.FC = () => {
  const [stackTrace, setStackTrace] = useState(`at PZ (https://mwoncovista.com/assets/index-DHUQ6z_J.js:293:11789)
    at div
    at s (https://mwoncovista.com/assets/index-DHUQ6z_J.js:10:6650)
    at FZ (https://mwoncovista.com/assets/index-DHUQ6z_J.js:293:36315)
    at pt (https://mwoncovista.com/assets/router-66oUNay2.js:3:3215)
    at ur (https://mwoncovista.com/assets/router-66oUNay2.js:3:6988)
    at div
    at a6 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:45:28180)
    at div
    at r6 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:45:27952)
    at z4 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:45:22150)
    at J4 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:45:24784)
    at div
    at div
    at Ge (https://mwoncovista.com/assets/index-DHUQ6z_J.js:56:1646)
    at See (https://mwoncovista.com/assets/index-DHUQ6z_J.js:368:1600)
    at Ct (https://mwoncovista.com/assets/index-DHUQ6z_J.js:56:16304)
    at div
    at Ge (https://mwoncovista.com/assets/index-DHUQ6z_J.js:56:1646)
    at pt (https://mwoncovista.com/assets/router-66oUNay2.js:3:3215)
    at ur (https://mwoncovista.com/assets/router-66oUNay2.js:3:6988)
    at gne
    at main
    at div
    at div
    at T6 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:45:37487)
    at u (https://mwoncovista.com/assets/index-DHUQ6z_J.js:10:76556)
    at u (https://mwoncovista.com/assets/index-DHUQ6z_J.js:10:76556)
    at a (https://mwoncovista.com/assets/index-DHUQ6z_J.js:118:809)
    at ik (https://mwoncovista.com/assets/index-DHUQ6z_J.js:118:1888)
    at f6 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:45:31347)
    at St (https://mwoncovista.com/assets/router-66oUNay2.js:3:6158)
    at sr (https://mwoncovista.com/assets/router-66oUNay2.js:3:15479)
    at rI (https://mwoncovista.com/assets/index-DHUQ6z_J.js:2:2003)
    at yne
    at div
    at Ge (https://mwoncovista.com/assets/index-DHUQ6z_J.js:56:1646)
    at P6 (https://mwoncovista.com/assets/index-DHUQ6z_J.js:56:10896)
    at xne (https://mwoncovista.com/assets/index-DHUQ6z_J.js:424:11744)
    at nM (https://mwoncovista.com/assets/index-DHUQ6z_J.js:31:17054)
    at vne (https://mwoncovista.com/assets/index-DHUQ6z_J.js:424:11844)`);
  
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeError = () => {
    const result = errorTracker.analyzeProductionError(stackTrace);
    setAnalysis(result);
  };

  const copyAnalysis = () => {
    const text = `
Production Error Analysis
========================

Stack Trace:
${stackTrace}

Possible Causes:
${analysis?.possibleCauses?.map((cause: string, i: number) => `${i + 1}. ${cause}`).join('\n') || 'None identified'}

Suggested Actions:
${analysis?.suggestedActions?.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n') || 'None identified'}

Related Components:
${analysis?.relatedComponents?.join(', ') || 'None identified'}

Generated: ${new Date().toISOString()}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('Analysis copied to clipboard!');
    });
  };

  const commonSolutions = [
    {
      title: "Enable Source Maps in Production",
      description: "Add 'sourcemap: true' to vite.config.ts build options for better debugging",
      code: `build: {
  sourcemap: true, // Enable for production debugging
  // ... other options
}`
    },
    {
      title: "Add Granular Error Boundaries",
      description: "Wrap suspect components with ErrorBoundary to isolate errors",
      code: `<ErrorBoundary moduleName="Suspect Component">
  <SuspectComponent />
</ErrorBoundary>`
    },
    {
      title: "Check useEffect Cleanup",
      description: "Ensure all async operations are properly cleaned up",
      code: `useEffect(() => {
  let isMounted = true;
  
  asyncOperation().then(result => {
    if (isMounted) {
      setState(result);
    }
  });
  
  return () => {
    isMounted = false;
  };
}, []);`
    },
    {
      title: "Add Global Error Handler",
      description: "Capture unhandled errors for better tracking",
      code: `window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to logging service
});`
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Production Error Analyzer</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Analyze minified production errors to identify potential causes and solutions.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stack Trace Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Production Stack Trace
            </label>
            <textarea
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Paste your production error stack trace here..."
            />
            <button
              onClick={analyzeError}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Analyze Error
            </button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                <button
                  onClick={copyAnalysis}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Possible Causes:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.possibleCauses.map((cause: string, i: number) => (
                      <li key={i} className="text-gray-700">{cause}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suggested Actions:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.suggestedActions.map((action: string, i: number) => (
                      <li key={i} className="text-gray-700">{action}</li>
                    ))}
                  </ul>
                </div>

                {analysis.relatedComponents.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Related Components:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.relatedComponents.map((component: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Common Solutions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Solutions</h3>
            <div className="space-y-4">
              {commonSolutions.map((solution, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{solution.title}</h4>
                  <p className="text-gray-600 mb-3">{solution.description}</p>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    <code>{solution.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Debug Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Debugging Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-700">
              <li>Navigate to `/debug/errors` to see real-time error capture</li>
              <li>Reproduce the error to capture it with enhanced context</li>
              <li>Check browser network tab for failed requests</li>
              <li>Verify all environment variables are properly set</li>
              <li>Test with different browsers and devices</li>
              <li>Check for console warnings before the error occurs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionErrorAnalyzer;
