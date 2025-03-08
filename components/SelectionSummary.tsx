import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  selectSelectedPokemonIds,
  clearSelection,
} from '../redux/slices/selectedPokemonSlice';
const SelectionSummary: React.FC = () => {
  const selectedIds = useAppSelector(selectSelectedPokemonIds);
  const dispatch = useAppDispatch();
  if (selectedIds.length === 0) return null;
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div>
        <span className="font-medium text-blue-800">{selectedIds.length}</span>
        <span className="text-blue-700"> Pokemon selected</span>
      </div>
      <button
        onClick={() => dispatch(clearSelection())}
        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
      >
        Clear Selection
      </button>
    </div>
  );
};
export default SelectionSummary;
