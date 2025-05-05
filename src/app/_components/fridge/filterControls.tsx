'use client';
import { FRIDGE_CATEGORIES } from '../../constants';

interface FilterControlsProps {
  selectedCategory: string | null;
  sortBy: 'name' | 'expiryDate' | 'category' | 'quantity';
  showExpiring: boolean;
  showLowStock: boolean;
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: 'name' | 'expiryDate' | 'category' | 'quantity') => void;
  onShowExpiringChange: (show: boolean) => void;
  onShowLowStockChange: (show: boolean) => void;
}

export const FilterControls = ({
  selectedCategory,
  sortBy,
  showExpiring,
  showLowStock,
  onCategoryChange,
  onSortChange,
  onShowExpiringChange,
  onShowLowStockChange,
}: FilterControlsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
        className="border rounded px-2 py-1 text-gray-200 bg-gray-900 [color-scheme:dark]"
      >
        <option value="name">Sort by Name</option>
        <option value="category">Sort by Category</option>
        <option value="expiryDate">Sort by Expiry</option>
        <option value="quantity">Sort by Quantity</option>
      </select>

      <select
        value={selectedCategory ?? ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        className="border rounded px-2 py-1 text-gray-200 bg-gray-900 [color-scheme:dark]"
      >
        <option value="">All Categories</option>
        {FRIDGE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat} className="text-gray-200 bg-gray-900 [color-scheme:dark]">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onShowExpiringChange(!showExpiring)}
          className={`px-2 py-1 border rounded flex items-center gap-2 ${
            showExpiring ? 'bg-blue-700 border-blue-500' : 'bg-gray-900 border-gray-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              showExpiring ? 'bg-blue-500 border-blue-300' : 'bg-gray-800 border-gray-600'
            }`}
          >
            {showExpiring && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>What&apos;s expiring soon?</span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onShowLowStockChange(!showLowStock)}
          className={`px-2 py-1 border rounded flex items-center gap-2 ${
            showLowStock ? 'bg-blue-700 border-blue-500' : 'bg-gray-900 border-gray-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              showLowStock ? 'bg-blue-500 border-blue-300' : 'bg-gray-800 border-gray-600'
            }`}
          >
            {showLowStock && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>What am I low on?</span>
        </button>
      </div>
    </div>
  );
};
