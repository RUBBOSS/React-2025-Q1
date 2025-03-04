import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectSelectedPokemonIds, clearSelection } from '../redux/slices/selectedPokemonSlice';

const SelectionSummary: React.FC = () => {
  const selectedIds = useAppSelector(selectSelectedPokemonIds);
  const dispatch = useAppDispatch();

  if (selectedIds.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex justify-between items-center">
      <div>
        <span className="font-medium text-blue-800">{selectedIds.length}</span>
        <span className="text-blue-700"> Pokemon selected</span>
      </div>
      <button
        onClick={() => dispatch(clearSelection())}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
      >
        Clear Selection
      </button>
    </div>
  );
};

export default SelectionSummary;
