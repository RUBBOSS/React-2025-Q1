import { useSearchParams, Routes, Route, Navigate } from 'react-router-dom';
import Search from './Search';
import Results from './Results';
import Details from './Details';
import NotFound from './NotFound';

const Layout = () => {
  const [searchParams] = useSearchParams();
  const showDetails = searchParams.has('details');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Pokémon Search</h1>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex gap-6">
              <div
                className={`${showDetails ? 'w-1/2' : 'w-full'} transition-all duration-300`}
              >
                <Search />
                <Results />
              </div>
              {showDetails && (
                <div className="w-1/2 sticky top-8 h-[calc(100vh-4rem)] transition-all duration-300">
                  <Details />
                </div>
              )}
            </div>
          }
        />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
};

export default Layout;
