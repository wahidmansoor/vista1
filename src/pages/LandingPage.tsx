import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '@/components/LoginButton';
import LogoutButton from '@/components/LogoutButton';

const LandingPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
          <div className="text-white text-xl font-semibold">
            🧬 OncoVista
          </div>
          <div className="text-white/80 text-sm mt-2">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600 text-white flex flex-col">      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-white">🧬</span> OncoVista
        </h1>
        {!isAuthenticated ? (
          <LoginButton className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-md hover:bg-indigo-100 transition" />
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-white/90">Welcome, {user?.name || user?.email}</span>
            <Link
              to="/dashboard"
              className="bg-green-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-green-700 transition"
            >
              Dashboard
            </Link>
            <LogoutButton className="bg-red-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-700 transition" />
          </div>
        )}
      </header>      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          AI-Powered Oncology Support<br />
          For Modern Clinicians
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-indigo-100">
          Streamline your workflow with intelligent tools for diagnosis, treatment, and patient education — all in one place.
        </p>
        
        {!isAuthenticated ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Welcome to OncoVista
            </h3>
            <p className="text-white/80 mb-6">
              Please log in to access the oncology resources and tools.
            </p>
            <LoginButton className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" />
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="bg-white text-indigo-700 hover:bg-indigo-100 px-6 py-3 rounded-lg text-lg font-medium transition"
            >
              Go to Dashboard
            </Link>
            
            {/* Quick Access Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Link 
                to="/opd" 
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">OPD Module</h3>
                <p className="text-white/80">Outpatient Department resources</p>
              </Link>
              
              <Link 
                to="/cdu" 
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">CDU Module</h3>
                <p className="text-white/80">Clinical Decision Unit tools</p>
              </Link>
              
              <Link 
                to="/inpatient" 
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">Inpatient</h3>
                <p className="text-white/80">Inpatient care management</p>
              </Link>
              
              <Link 
                to="/palliative" 
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">Palliative Care</h3>
                <p className="text-white/80">Palliative care resources</p>
              </Link>
              
              <Link 
                to="/tools" 
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">Tools</h3>
                <p className="text-white/80">Clinical calculators and tools</p>
              </Link>
              
              <Link 
                to="/handbook" 
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">Handbook</h3>
                <p className="text-white/80">Clinical guidelines and protocols</p>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-4 text-indigo-100">
        © {new Date().getFullYear()} OncoVista · Empowering Oncology Excellence
      </footer>
    </div>
  );
};

export default LandingPage;
