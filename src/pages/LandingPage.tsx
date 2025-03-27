import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600 text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-white">🧬</span> OncoVista
        </h1>
        <Link
          to="/handbook"
          className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-md hover:bg-indigo-100 transition"
        >
          Enter App
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          AI-Powered Oncology Support<br />
          For Modern Clinicians
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-indigo-100">
          Streamline your workflow with intelligent tools for diagnosis, treatment, and patient education — all in one place.
        </p>
        <Link
          to="/handbook"
          className="bg-white text-indigo-700 hover:bg-indigo-100 px-6 py-3 rounded-lg text-lg font-medium transition"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-4 text-indigo-100">
        © {new Date().getFullYear()} OncoVista · Empowering Oncology Excellence
      </footer>
    </div>
  );
};

export default LandingPage;
