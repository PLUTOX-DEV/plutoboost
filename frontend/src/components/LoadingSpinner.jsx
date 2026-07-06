import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <RefreshCw size={32} className="animate-spin text-purple-400" />
      <p className="text-gray-400">{text}</p>
    </div>
  );
};

export default LoadingSpinner;