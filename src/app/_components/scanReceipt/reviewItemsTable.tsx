'use client';

import { FRIDGE_CATEGORIES } from '../../constants';
import { type ReviewItem } from './types';

interface ReviewItemsTableProps {
  reviewItems: ReviewItem[];
  isProcessing: boolean;
  onEditItem: (index: number, field: keyof ReviewItem, value: string | number | boolean) => void;
  onAddToFridge: () => Promise<void>;
}

export const ReviewItemsTable = ({
  reviewItems,
  isProcessing,
  onEditItem,
  onAddToFridge,
}: ReviewItemsTableProps) => {
  if (reviewItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Extracted Items</h2>
      <p className="mb-4 text-gray-300">
        Review and edit items before adding them to your fridge. You can toggle between food and
        non-food items, adjust the category, quantity, and estimated days until expiry.
      </p>

      <div className="flex justify-between mb-4">
        <div>
          <span className="mr-4 text-green-400">
            Food Items: {reviewItems.filter((item) => item.isFood).length}
          </span>
          <span className="text-yellow-400">
            Non-Food Items: {reviewItems.filter((item) => !item.isFood).length}
          </span>
        </div>
        <button
          onClick={onAddToFridge}
          disabled={isProcessing || reviewItems.filter((item) => item.isFood).length === 0}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Adding...' : 'Add All Food Items to Fridge'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-2">Item</th>
              <th className="text-left px-4 py-2">Original Receipt Name</th>
              <th className="text-left px-4 py-2">Food/Non-Food</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Quantity</th>
              <th className="text-left px-4 py-2">Est. Days Until Expiry</th>
            </tr>
          </thead>
          <tbody>
            {reviewItems.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700 ${item.isFood ? '' : 'bg-gray-900/40'}`}
              >
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onEditItem(index, 'name', e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                </td>
                <td className="px-4 py-2 text-gray-400 text-sm">{item.originalName}</td>
                <td className="px-4 py-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isFood}
                      onChange={(e) => onEditItem(index, 'isFood', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-300">
                      {item.isFood ? 'Food' : 'Non-Food'}
                    </span>
                  </label>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={item.category}
                    onChange={(e) => onEditItem(index, 'category', e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                    disabled={!item.isFood}
                  >
                    {FRIDGE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onEditItem(index, 'quantity', e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                    disabled={!item.isFood}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={item.expiryDays ?? ''}
                    onChange={(e) => onEditItem(index, 'expiryDays', e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                    placeholder="Optional"
                    disabled={!item.isFood}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
