import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const LoadingIndicator: React.FC = () => {
  const loading = useSelector((state: RootState) => state.apiStatus.loading);
  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="p-6 rounded-lg shadow-xl">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  ) : null;
};

export default LoadingIndicator;
