import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { LayoutProvider } from './context/LayoutContext';
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";
import Auth0Provider from './providers/Auth0Provider';

const App: React.FC = () => {
  return (
    <Auth0Provider>
      <LayoutProvider>
        <BrowserRouter>
          <ToastProvider>
            <Toast />
            <Layout>
              <AppRoutes />
            </Layout>
          </ToastProvider>
        </BrowserRouter>
      </LayoutProvider>
    </Auth0Provider>
  );
};

export default App;
