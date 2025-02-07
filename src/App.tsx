import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Search from './components/Search';
import Results from './components/Results';
import ErrorThrowingComponent from './components/ErrorThrowingComponent';
import './App.css';
import { SearchProvider } from './context/SearchContext';

const App = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const resetErrorState = () => {
    setShouldThrowError(false);
  };

  return (
    <div className="app-container">
      <ErrorBoundary resetErrorState={resetErrorState}>
        <SearchProvider>
          <Search />
          <Results />
          <button
            className="error-button"
            onClick={() => setShouldThrowError(true)}
          >
            Trigger Error
          </button>
          <ErrorThrowingComponent shouldThrow={shouldThrowError} />
        </SearchProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
