import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import GlowingLogoImage from "@/components/GlowingLogoImage";
import {
  Stethoscope,
  Brain,
  Activity,
  Shield,
  Users,
  TrendingUp,
  Microscope,
  Heart,
  Star,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
  X
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [currentText, setCurrentText] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showDemoModal, setShowDemoModal] = useState(false);

  const heroTexts = [
    "AI-Powered Oncology Support",
    "Intelligent Clinical Decisions", 
    "Advanced Cancer Care Tools",
    "Medical Excellence Platform"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-indigo-800 to-purple-900">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative mb-8"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${25 + i * 5}px 0px`
                }}
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
          <motion.div
            className="text-white text-xl font-semibold mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            OncoVista
          </motion.div>
          <div className="text-white/80 text-sm">Loading Medical AI Platform...</div>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const moduleCards = [
    { name: "OPD Module", to: "/opd", desc: "Outpatient Department resources", icon: <Users className="w-8 h-8" />, color: "from-cyan-500 to-blue-600" },
    { name: "CDU Module", to: "/cdu", desc: "Clinical Decision Unit tools", icon: <Brain className="w-8 h-8" />, color: "from-purple-500 to-indigo-600" },
    { name: "Inpatient", to: "/inpatient", desc: "Inpatient care management", icon: <Activity className="w-8 h-8" />, color: "from-green-500 to-emerald-600" },
    { name: "Palliative Care", to: "/palliative", desc: "Palliative care resources", icon: <Heart className="w-8 h-8" />, color: "from-rose-500 to-pink-600" },
    { name: "Tools", to: "/tools", desc: "Clinical calculators and tools", icon: <Microscope className="w-8 h-8" />, color: "from-amber-500 to-orange-600" },
    { name: "Handbook", to: "/handbook", desc: "Clinical guidelines and protocols", icon: <Shield className="w-8 h-8" />, color: "from-violet-500 to-purple-600" },
  ];

  const stats = [
    { label: "Active Users", value: "2,847", icon: <Users className="w-6 h-6" />, trend: "+12%" },
    { label: "Cases Analyzed", value: "15.2K", icon: <Brain className="w-6 h-6" />, trend: "+24%" },
    { label: "Success Rate", value: "94.7%", icon: <Target className="w-6 h-6" />, trend: "+3.2%" },
    { label: "AI Insights", value: "8.9K", icon: <Zap className="w-6 h-6" />, trend: "+18%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004D61] via-[#005B8F] to-[#3B1D74] text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (mousePosition.x - window.innerWidth / 2) * 0.01],
              y: [0, (mousePosition.y - window.innerHeight / 2) * 0.01],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="z-10 flex justify-between items-center px-8 py-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="max-w-[140px]">
            <GlowingLogoImage />
          </div>
        </motion.div>

        {!isAuthenticated ? (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <LoginButton className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300" />
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span 
              className="text-white/90 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              Welcome, {user?.name || user?.email}
            </motion.span>
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Dashboard
            </Link>
            <LogoutButton className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300" />
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        className="z-10 flex flex-1 flex-col items-center justify-center text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentText}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {heroTexts[currentText]}
            </motion.h2>
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl max-w-3xl mb-12 text-indigo-100 leading-relaxed"
          variants={itemVariants}
        >
          Streamline your workflow with intelligent tools for diagnosis, treatment, and patient education — all in one place.
        </motion.p>

        {/* Stats Cards */}
<motion.div 
  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
  variants={containerVariants}
>
  {/* Oncology Protocols */}
  <motion.div
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    variants={itemVariants}
    whileHover={{ 
      scale: 1.05, 
      backgroundColor: "rgba(255,255,255,0.15)",
      transition: { duration: 0.3 }
    }}
  >
    <div className="flex items-center justify-center mb-3 text-cyan-400">
      <Microscope className="w-6 h-6" />
    </div>
    <div className="text-2xl font-bold mb-1">120+</div>
    <div className="text-sm text-white/70 mb-1">Oncology Protocols</div>
    <div className="text-xs text-green-400 font-medium">+5 this month</div>
  </motion.div>

  {/* AI Handbook Topics */}
  <motion.div
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    variants={itemVariants}
    whileHover={{ 
      scale: 1.05, 
      backgroundColor: "rgba(255,255,255,0.15)",
      transition: { duration: 0.3 }
    }}
  >
    <div className="flex items-center justify-center mb-3 text-cyan-400">
      <BookOpen className="w-6 h-6" />
    </div>
    <div className="text-2xl font-bold mb-1">250+</div>
    <div className="text-sm text-white/70 mb-1">AI Handbook Topics</div>
    <div className="text-xs text-green-400 font-medium">+10 added</div>
  </motion.div>

  {/* Success Rate */}
  <motion.div
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    variants={itemVariants}
    whileHover={{ 
      scale: 1.05, 
      backgroundColor: "rgba(255,255,255,0.15)",
      transition: { duration: 0.3 }
    }}
  >
    <div className="flex items-center justify-center mb-3 text-cyan-400">
      <Target className="w-6 h-6" />
    </div>
    <div className="text-2xl font-bold mb-1">94.7%</div>
    <div className="text-sm text-white/70 mb-1">Success Rate</div>
    <div className="text-xs text-green-400 font-medium">+3.2%</div>
  </motion.div>

  {/* AI Insights */}
  <motion.div
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    variants={itemVariants}
    whileHover={{ 
      scale: 1.05, 
      backgroundColor: "rgba(255,255,255,0.15)",
      transition: { duration: 0.3 }
    }}
  >
    <div className="flex items-center justify-center mb-3 text-cyan-400">
      <Zap className="w-6 h-6" />
    </div>
    <div className="text-2xl font-bold mb-1">8.9K</div>
    <div className="text-sm text-white/70 mb-1">AI Insights</div>
    <div className="text-xs text-green-400 font-medium">+18%</div>
  </motion.div>
</motion.div>


        {!isAuthenticated ? (
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-white mb-4"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Welcome to OncoVista
            </motion.h3>
            <p className="text-white/80 mb-6">
              Please log in to access the oncology resources and tools.
            </p>
            <LoginButton className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center gap-2" />
          </motion.div>
        ) : (
          <motion.div className="space-y-8" variants={itemVariants}>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-white to-gray-100 text-indigo-700 hover:from-gray-100 hover:to-gray-200 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <Brain className="w-5 h-5" />
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <motion.button
                onClick={() => setShowDemoModal(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Module Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              variants={containerVariants}
            >
              {moduleCards.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.to}
                    className="block group"
                  >
                    <div className={`bg-gradient-to-br ${item.color} p-1 rounded-2xl shadow-2xl`}>
                      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 h-full border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                        <motion.div
                          className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl text-white"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.div>
                        <h3 className="font-bold text-lg mb-2 text-white">{item.name}</h3>
                        <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                        <motion.div 
                          className="mt-4 flex items-center text-white/90 text-sm font-medium"
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                        >
                          Explore <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.main>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Container */}
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="OncoVista Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-2xl"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
                <h3 className="text-xl font-bold text-white mb-2">OncoVista Platform Demo</h3>
                <p className="text-white/80 text-sm">
                  Experience the power of AI-driven oncology support tools designed for modern healthcare professionals.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        className="z-10 text-center text-sm py-6 text-indigo-100 border-t border-white/10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.div
          className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-4"
          animate={{ scaleX: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <p>© {new Date().getFullYear()} OncoVista · Empowering Oncology Excellence</p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
