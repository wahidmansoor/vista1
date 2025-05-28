import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { LayoutProvider } from './context/LayoutContext';
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <BrowserRouter>
        <ToastProvider>
          <Toast />
          <Layout>
            <AppRoutes />
          </Layout>
        </ToastProvider>
      </BrowserRouter>
    </LayoutProvider>  );
};

export default App;
