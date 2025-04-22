import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-sm text-gray-600">Generating your idea...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
