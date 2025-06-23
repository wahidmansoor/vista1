import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-5 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition hover:scale-105 flex flex-col justify-center items-center text-center space-y-3"
    >
      <Icon size={40} className="text-indigo-500 dark:text-indigo-400" />
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default ToolCard;