export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"
        role="status"
        aria-label="Loading"
      ></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
}
