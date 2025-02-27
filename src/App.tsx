import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';
import { ClickOutsideProvider } from './context/ClickOutsideContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import './styles/pokemon-types.css';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ErrorBoundary resetErrorState={() => {}}>
            <SearchProvider>
              <ClickOutsideProvider>
                <Routes>
                  <Route path="/" element={<Layout />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ClickOutsideProvider>
            </SearchProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
