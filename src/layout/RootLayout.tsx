import { Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/toaster';
import Header from './Header';
import { LayoutProvider } from '../context/LayoutContext';

export default function RootLayout() {
  return (
    <LayoutProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </LayoutProvider>
  );
}
