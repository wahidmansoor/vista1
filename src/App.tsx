import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Layout } from './layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { LayoutProvider } from './context/LayoutContext';
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Define public routes that should NOT have Layout (Sidebar + Header)
  const publicRoutes = ['/', '/callback'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <ToastProvider>
      <Toast />
      {isPublicRoute ? (
        <AppRoutes />
      ) : (
        <Layout>
          <AppRoutes />
        </Layout>
      )}
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
