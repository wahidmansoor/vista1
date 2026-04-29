import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/tools')}
        className="mb-8 flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
      >
        <ArrowLeft size={16} />
        Back to Tools
      </Button>

      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-indigo-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {description}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
