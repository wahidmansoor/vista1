import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { callAIAgentWithRetry } from '@/lib/api/aiAgentAPI';
import { toast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle AI query when button is clicked
  const handleAIQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a question for OncoVista AI.",
        variant: "destructive"
      });
      return;
    }    setLoading(true);
    setAiResponse(null);

    try {
      const response = await callAIAgentWithRetry({
        module: 'OPD',              // Using OPD as default clinical module
        intent: 'evaluation',       // Using evaluation as default intent for general queries
        prompt: query.trim(),
        mockMode: false             // set to true for local testing
      });

      setAiResponse(response.content);
      
      // Success feedback
      toast({
        title: "AI Response Generated",
        description: "OncoVista AI has analyzed your query successfully.",
      });

    } catch (error: any) {
      console.error("AI Query Error:", error);
      
      // Provide specific error feedback based on error type
      let errorTitle = "AI Agent Error";
      let errorDescription = "Something went wrong. Please try again.";
      
      if (error?.message?.includes('rate limit')) {
        errorTitle = "Rate Limit Exceeded";
        errorDescription = "Too many requests. Please wait a moment and try again.";
      } else if (error?.message?.includes('timeout')) {
        errorTitle = "Request Timeout";
        errorDescription = "The AI service is taking too long to respond. Please try again.";
      } else if (error?.message?.includes('API key')) {
        errorTitle = "Configuration Error";
        errorDescription = "AI service is not properly configured. Contact administrator.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
          <div className="text-white text-xl font-semibold">🧬 OncoVista</div>
          <div className="text-white/80 text-sm mt-2">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center bg-white/10 backdrop-blur-lg p-10 rounded-xl max-w-md w-full shadow-lg">
          <h2 className="text-white text-2xl font-bold mb-4">Welcome to OncoVista</h2>
          <p className="text-white/70 mb-6">Please sign in to access your clinical AI console.</p>
          <LoginButton className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🧬 OncoVista AI Console</h1>
          <p className="text-white/80 text-lg">
            Welcome {user?.name?.split(' ')[0] || 'Doctor'}, your AI companion is ready.
          </p>
        </div>        {/* AI Prompt Console */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Ask OncoVista AI</h2>
          
          {/* Suggested Prompts */}
          <div className="mb-4">
            <p className="text-sm text-white/70 mb-2">Try these suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'What are the screening guidelines for breast cancer?',
                'How to manage grade 3 neutropenia?',
                'Latest treatment protocols for lung cancer',
                'Palliative care options for advanced disease'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="text-xs px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full hover:bg-blue-500/30 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            placeholder="Ask about staging, treatment options, screening protocols, toxicity management..."
            className="w-full p-4 rounded-md text-black min-h-[120px] shadow-md resize-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
          <div className="text-right mt-4">
            <button
              onClick={handleAIQuery}
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  🔎 Ask AI Agent
                </>
              )}
            </button>
          </div>
        </div>        {/* ✅ Display AI Response */}
        {aiResponse && (
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                🧠
              </div>
              <h3 className="text-xl font-semibold">OncoVista AI Response</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                {aiResponse}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-white/60">
                💡 This AI response is for educational purposes. Always verify with current guidelines and consult with senior colleagues for clinical decisions.
              </p>
            </div>
          </div>
        )}

        {/* Smart Feed and Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">📬 Smart Update Feed</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>🔹 NCCN added Lung Stage IIIb flowchart</li>
              <li>🔹 AI detected rising use of XELOX → tip card added</li>
              <li>🔹 3 new cases in Palliative Studies</li>
            </ul>
          </div>

          <div className="bg-white/10 rounded-lg p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">🔮 AI Suggestions</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>🧠 Add ECOG score before CDU to optimize dose</li>
              <li>🧠 Try HER2 tracker under breast tools</li>
              <li>🧠 Use flashcards to retain guideline pearls</li>
            </ul>
          </div>
        </div>

        {/* Session Summary */}
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-lg">
          <h3 className="text-xl font-semibold mb-2">📊 Session Snapshot</h3>
          <ul className="text-sm list-disc list-inside text-white/80">
            <li>Accessed: Handbook → Symptom Control</li>
            <li>Queried: "Preferred antiemetic with irinotecan"</li>
            <li>Reviewed: XELOX, FOLFOX, and XELIRI regimens</li>
          </ul>
        </div>

        {/* Logout */}
        <div className="text-center pt-8">
          <LogoutButton className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
