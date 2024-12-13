import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-2">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1 text-sm text-gray-500">
      <span>Made with</span>
      <Heart className="w-4 h-4 text-red-500" />
      <span>by MediMind Team © {new Date().getFullYear()}</span>
    </div>
  </footer>
);