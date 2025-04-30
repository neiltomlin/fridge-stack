'use client';
import { FRIDGE_CATEGORIES } from '../constants';

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
        value={selectedCategory ?? ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        className="border rounded px-2 py-1 [color-scheme:dark]"
      >
        <option value="">All Categories</option>
        {FRIDGE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat} className="[color-scheme:dark]">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
        className="border rounded px-2 py-1 [color-scheme:dark]"
      >
        <option value="name">Sort by Name</option>
        <option value="category">Sort by Category</option>
        <option value="expiryDate">Sort by Expiry Date</option>
        <option value="quantity">Sort by Quantity</option>
      </select>

      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={showExpiring}
          onChange={(e) => onShowExpiringChange(e.target.checked)}
          className="[color-scheme:dark]"
        />
        Show Expiring Soon
      </label>

      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={showLowStock}
          onChange={(e) => onShowLowStockChange(e.target.checked)}
          className="[color-scheme:dark]"
        />
        Show Low Stock
      </label>
    </div>
  );
};
