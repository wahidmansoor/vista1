import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";

const LandingPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-indigo-800 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
          <div className="text-white text-xl font-semibold">OncoVista</div>
          <div className="text-white/80 text-sm mt-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004D61] via-[#005B8F] to-[#3B1D74] text-white flex flex-col relative overflow-hidden">
      {/* Floating Circles Animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-8 h-8 bg-white/10 rounded-full animate-pulse blur-md`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="z-10 flex justify-between items-center px-8 py-4">
        <div className="flex items-center space-x-3">
          <img src="/icons/mine.png" alt="OncoVista Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold tracking-tight">OncoVista</h1>
        </div>
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
      </header>

      {/* Hero Section */}
      <main className="z-10 flex flex-1 flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          AI-Powered Oncology Support<br />
          For Modern Clinicians
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-indigo-100">
          Streamline your workflow with intelligent tools for diagnosis, treatment, and patient education — all in one place.
        </p>

        {!isAuthenticated ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Welcome to OncoVista</h3>
            <p className="text-white/80 mb-6">
              Please log in to access the oncology resources and tools.
            </p>
            <LoginButton className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" />
          </div>
        ) : (
          <div className="space-y-6">
            <Link
              to="/dashboard"
              className="bg-white text-indigo-700 hover:bg-indigo-100 px-6 py-3 rounded-lg text-lg font-medium transition"
            >
              Go to Dashboard
            </Link>

            {/* Quick Access Grid */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                { name: "OPD Module", to: "/opd", desc: "Outpatient Department resources" },
                { name: "CDU Module", to: "/cdu", desc: "Clinical Decision Unit tools" },
                { name: "Inpatient", to: "/inpatient", desc: "Inpatient care management" },
                { name: "Palliative Care", to: "/palliative", desc: "Palliative care resources" },
                { name: "Tools", to: "/tools", desc: "Clinical calculators and tools" },
                { name: "Handbook", to: "/handbook", desc: "Clinical guidelines and protocols" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-white/80">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="z-10 text-center text-sm py-4 text-indigo-100">
        © {new Date().getFullYear()} OncoVista · Empowering Oncology Excellence
      </footer>
    </div>
  );
};

export default LandingPage;
