import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
