'use client';
import dayjs from 'dayjs';
// import { api } from '~/trpc/react';
import { DeleteFromFridgeButton } from './deleteFromFridgeButton';
import { CategoryBadge, ExpiryBadge } from './badges';
import { QuantityBadge } from './quantityBadge';
import type { FridgeCategory } from '../constants';
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
  const [showExpiring, setShowExpiring] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);

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
      switch (sortBy) {
        case 'name':
          return (a.name ?? '').localeCompare(b.name ?? '');
        case 'category':
          return (a.category ?? '').localeCompare(b.category ?? '');
        case 'quantity':
          return (a.quantity ?? 0) - (b.quantity ?? 0);
        case 'expiryDate':
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return dayjs(a.expiryDate).diff(dayjs(b.expiryDate));
      }
    });

  return (
    <div className="w-full max-w-2xl">
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
            <th className="py-2 px-4">Item</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Expires</th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedContents.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
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
