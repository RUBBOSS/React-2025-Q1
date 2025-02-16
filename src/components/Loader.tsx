import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0  flex items-center justify-center z-50">
      <div
        data-testid="loader"
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
      />
    </div>
  );
};

export default Loader;
