'use client';
import { FRIDGE_CATEGORIES } from '../constants';

interface FilterControlsProps {
  selectedCategory: string | null;
  sortBy: 'name' | 'expiryDate' | 'category';
  showExpiring: boolean;
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: 'name' | 'expiryDate' | 'category') => void;
  onShowExpiringChange: (show: boolean) => void;
}

export const FilterControls = ({
  selectedCategory,
  sortBy,
  showExpiring,
  onCategoryChange,
  onSortChange,
  onShowExpiringChange,
}: FilterControlsProps) => {
  return (
    <div className="flex gap-4 mb-4 items-center">
      <select
        value={selectedCategory ?? ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        className="border rounded px-2 py-1 [color-scheme:dark]"
      >
        <option value="">All Categories</option>
        {FRIDGE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'name' | 'expiryDate' | 'category')}
        className="border rounded px-2 py-1 [color-scheme:dark]"
      >
        <option value="name">Sort by Name</option>
        <option value="expiryDate">Sort by Expiry Date</option>
        <option value="category">Sort by Category</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showExpiring}
          onChange={(e) => onShowExpiringChange(e.target.checked)}
          className="rounded"
        />
        <span>Show Expiring Soon</span>
      </label>
    </div>
  );
};
