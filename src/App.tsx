import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SearchProvider>
          <Layout />
        </SearchProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
