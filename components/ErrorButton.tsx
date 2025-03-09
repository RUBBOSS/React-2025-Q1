import React from 'react';
const ErrorButton: React.FC = () => {
  const handleClick = () => {
    throw new Error('This is a test error from the Error Button');
  };
  return (
    <button
      onClick={handleClick}
      className="mt-2 rounded-md bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
    >
      Throw Test Error
    </button>
  );
};
export default ErrorButton;
