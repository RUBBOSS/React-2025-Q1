import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearSelected } from '../features/selectedItemsSlice';

const Flyout = () => {
  const dispatch = useDispatch();
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
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${count}_items.csv`;
    a.click();
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
    </div>
  );
};

export default Flyout;
