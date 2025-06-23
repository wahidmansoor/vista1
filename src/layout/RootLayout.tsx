import { Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/toaster';
import Header from './Header';
import { LayoutProvider } from '../context/LayoutContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary moduleName="Global">
      <LayoutProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-16"> {/* Added mt-16 to account for fixed header height */}
          <Outlet />
        </main>
        <Toaster />
      </div>
      </LayoutProvider>
    </ErrorBoundary>
  );
}
