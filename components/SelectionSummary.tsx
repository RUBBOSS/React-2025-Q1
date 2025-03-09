import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  selectSelectedPokemonIds,
  clearSelection,
} from '../redux/slices/selectedPokemonSlice';

const SelectionSummary: React.FC = () => {
  const selectedIds = useAppSelector(selectSelectedPokemonIds);
  const dispatch = useAppDispatch();
  const count = selectedIds.length;

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  return (
    <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
      <div>
        <span className="font-medium text-blue-800">{count}</span>
        {' Pokemon selected'}
      </div>
      <button
        onClick={handleClearSelection}
        disabled={count === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Clear Selection
      </button>
    </div>
  );
};

export default SelectionSummary;
