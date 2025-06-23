import React from 'react';
import { BookX, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopicNotFoundProps {
  error: string;
}

export default function TopicNotFound({ error }: TopicNotFoundProps) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
        {error}
      </h2>
    </div>
  );
}