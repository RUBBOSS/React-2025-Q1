import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary resetErrorState={() => {}}>
        <SearchProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SearchProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
