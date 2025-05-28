import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { LayoutProvider } from './context/LayoutContext';
import { AutoLogoutProvider } from './providers/AutoLogoutProvider';
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <BrowserRouter>
        <AutoLogoutProvider>
          <ToastProvider>
            <Toast />
            <Layout>
              <AppRoutes />
            </Layout>
          </ToastProvider>
        </AutoLogoutProvider>
      </BrowserRouter>
    </LayoutProvider>
  );
};

export default App;
