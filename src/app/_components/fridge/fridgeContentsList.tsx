'use client';
import dayjs from 'dayjs';
import { DeleteFromFridgeButton } from './deleteFromFridgeButton';
import { CategoryBadge, ExpiryBadge } from './badges';
import { QuantityBadge } from './quantityBadge';
import type { FridgeCategory } from '../../constants';
import { FilterControls } from './filterControls';
import { useState } from 'react';

type FridgeContentsListProps = {
  contents: {
    id: number;
    name: string;
    category: FridgeCategory | null;
    quantity: number | null;
    expiryDate: Date | null;
  }[];
  isLoading: boolean;
};

export const FridgeContentsList = ({ contents, isLoading }: FridgeContentsListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'expiryDate' | 'category' | 'quantity'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showExpiring, setShowExpiring] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);

  // Function to handle column header clicks
  const handleSortChange = (column: 'name' | 'expiryDate' | 'category' | 'quantity') => {
    if (sortBy === column) {
      // If already sorting by this column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new column, set it and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  if (isLoading || !contents) {
    return <div>Loading...</div>;
  }

  const filteredAndSortedContents = contents
    .filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }
      if (showExpiring && item.expiryDate) {
        return dayjs(item.expiryDate).isBefore(dayjs().add(3, 'day'), 'day');
      }
      if (showLowStock) {
        return (item.quantity ?? 0) <= 3;
      }
      return true;
    })
    .sort((a, b) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'name':
          return directionMultiplier * (a.name ?? '').localeCompare(b.name ?? '');
        case 'category':
          return directionMultiplier * (a.category ?? '').localeCompare(b.category ?? '');
        case 'quantity':
          return directionMultiplier * ((a.quantity ?? 0) - (b.quantity ?? 0));
        case 'expiryDate':
          if (!a.expiryDate) return 1 * directionMultiplier;
          if (!b.expiryDate) return -1 * directionMultiplier;
          return directionMultiplier * dayjs(a.expiryDate).diff(dayjs(b.expiryDate));
      }
    });

  return (
    <div className="w-full max-w-4xl">
      <FilterControls
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        showExpiring={showExpiring}
        showLowStock={showLowStock}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortBy}
        onShowExpiringChange={setShowExpiring}
        onShowLowStockChange={setShowLowStock}
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th
              className="py-2 px-4 cursor-pointer hover:bg-gray-300/20"
              onClick={() => handleSortChange('name')}
            >
              Item {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-2 px-4 cursor-pointer hover:bg-gray-300/20"
              onClick={() => handleSortChange('category')}
            >
              Category {sortBy === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-2 px-4 cursor-pointer hover:bg-gray-300/20"
              onClick={() => handleSortChange('quantity')}
            >
              Quantity {sortBy === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-2 px-4 cursor-pointer hover:bg-gray-300/20"
              onClick={() => handleSortChange('expiryDate')}
            >
              Expires {sortBy === 'expiryDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedContents.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">
                <CategoryBadge category={item.category} />
              </td>
              <td className="py-2 px-4">
                <QuantityBadge quantity={item.quantity ?? 0} />
              </td>
              <td className="py-2 px-4">
                <ExpiryBadge date={item.expiryDate ?? null} />
              </td>
              <td className="py-2 px-4">
                <DeleteFromFridgeButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredAndSortedContents.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          {contents.length === 0
            ? 'No items in the fridge yet'
            : 'No items match the current filters'}
        </p>
      )}
    </div>
  );
};
