import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { Auth0Provider } from './auth/auth-provider';
import { UserProvider } from './context/UserContext';
import { validateEnv } from './utils/validateEnv';
import { Stethoscope, Brain, Activity } from 'lucide-react';
import GlowingLogoImage from './components/GlowingLogoImage';

validateEnv();

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { text: "Initializing OncoVista AI", icon: <Brain className="w-8 h-8" /> },
    { text: "Loading Medical Protocols", icon: <Stethoscope className="w-8 h-8" /> },
    { text: "Connecting to AI Engine", icon: <Activity className="w-8 h-8" /> },
    { text: "Ready for Clinical Excellence", icon: <Brain className="w-8 h-8" /> }
  ];

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepTimer);
          setTimeout(onComplete, 1000);
          return prev;
        }
      });
    }, 800);
    return () => clearInterval(stepTimer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, hsl(195, 100%, 19%) 0%, hsl(200, 100%, 28%) 50%, hsl(264, 83%, 23%) 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div className="text-center z-10">
        <motion.div
          className="mb-8"
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.div
          className="mb-4 max-w-[180px] mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <GlowingLogoImage />
        </motion.div>

        <div className="space-y-4 min-h-[120px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingStep}
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-cyan-400"
              >
                {loadingSteps[loadingStep].icon}
              </motion.div>
              <span className="text-white font-medium">{loadingSteps[loadingStep].text}</span>
            </motion.div>
          </AnimatePresence>

          <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AppInitializer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const handleSplashComplete = () => setIsLoading(false);

  return (
    <React.StrictMode>
      <Auth0Provider>
        <UserProvider>
          <ErrorBoundary moduleName="App Root">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <SplashScreen key="splash" onComplete={handleSplashComplete} />
              ) : (
                <motion.div
                  key="app"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <App />
                </motion.div>
              )}
            </AnimatePresence>
          </ErrorBoundary>
        </UserProvider>
      </Auth0Provider>
    </React.StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppInitializer />);
