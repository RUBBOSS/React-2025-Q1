import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const SplitLayout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasDetails = searchParams.has('details');

  const handleMainSectionClick = () => {
    if (hasDetails) {
      searchParams.delete('details');
      navigate({ search: searchParams.toString() });
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4">
      <div
        className={`transition-all duration-300 ${
          hasDetails ? 'w-1/2' : 'w-full'
        }`}
        onClick={handleMainSectionClick}
      >
        <div className="h-full overflow-auto p-4">
          {/* Main content (search results) will be rendered here */}
        </div>
      </div>
      {hasDetails && (
        <div className="w-1/2 bg-white shadow-lg rounded-lg overflow-auto">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default SplitLayout;
