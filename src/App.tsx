import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext.tsx';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary resetErrorState={() => {}}>
        <SearchProvider>
          <Layout />
        </SearchProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
