import React from 'react';
import { useUser } from '../hooks/useUser';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useUser();

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
        </div>

        {/* AI Prompt Console */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Ask OncoVista AI</h2>
          <textarea
            placeholder="Ask about staging, treatment options, red flags..."
            className="w-full p-4 rounded-md text-black min-h-[120px] shadow-md"
          ></textarea>
          <div className="text-right mt-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              🔎 Run AI Query
            </button>
          </div>
        </div>

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
