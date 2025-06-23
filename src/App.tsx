import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { LayoutProvider } from './context/LayoutContext';
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 1.02 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Define public routes that should NOT have Layout (Sidebar + Header)
  const publicRoutes = ['/', '/callback'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <ToastProvider>
      <Toast />
      <PageTransition>
        {isPublicRoute ? (
          <AppRoutes />
        ) : (
          <Layout>
            <AppRoutes />
          </Layout>
        )}
      </PageTransition>
    </ToastProvider>
  );
};

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LayoutProvider>
  );
};

export default App;
