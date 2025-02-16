import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { RootState } from '../store/store';
import { clearSelected } from '../features/selectedItemsSlice';

const Flyout = () => {
  const dispatch = useDispatch();
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.items
  );
  const count = Object.keys(selectedItems).length;

  if (count === 0) return null;

  const handleUnselectAll = () => {
    dispatch(clearSelected());
  };

  const handleDownload = () => {
    const headers = ['name', 'url'];
    const rows = Object.values(selectedItems).map((item) => [
      item.name,
      item.url,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const firstItemUrl = Object.values(selectedItems)[0]?.url || '';
    const typeMatch = firstItemUrl.match(/\/api\/v2\/([^/]+)/);
    const type = typeMatch ? typeMatch[1] : 'items';
    const filename = `${count}_${type}.csv`;

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = URL.createObjectURL(blob);
      downloadLinkRef.current.download = filename;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(downloadLinkRef.current.href);
    }
  };

  return (
    <div className="flyout fixed bottom-4 right-4 z-50 bg-white p-4 rounded shadow-lg flex items-center gap-4">
      <div className="flex flex-col items-center">
        <span className="font-bold text-sm text-black">{count}</span>
        <img src="/shopping-cart.png" alt="Cart" className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={handleUnselectAll}>
          <img
            src="/remove-from-cart.png"
            alt="Remove from Cart"
            className="w-6 h-6"
          />
        </button>
        <button onClick={handleDownload}>
          <img src="/download.png" alt="Download" className="w-6 h-6" />
        </button>
      </div>
      <a ref={downloadLinkRef} className="hidden" />
    </div>
  );
};

export default Flyout;
