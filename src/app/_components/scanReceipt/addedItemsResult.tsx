'use client';

import Link from 'next/link';
import { type AddedItemResult } from './types';

interface AddedItemsResultProps {
  addedItems: AddedItemResult[];
  onReset: () => void;
}

export const AddedItemsResult = ({ addedItems, onReset }: AddedItemsResultProps) => {
  if (addedItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Items Added to Fridge</h2>

      <div className="space-y-2 mb-6">
        {addedItems.map((result, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              result.success
                ? 'bg-green-900/30 border border-green-500 text-green-300'
                : 'bg-red-900/30 border border-red-500 text-red-300'
            }`}
          >
            {result.success ? '✓ ' : '✗ '}
            {result.item}{' '}
            {!result.success &&
              result.error &&
              `- Error: ${
                typeof result.error === 'string'
                  ? result.error
                  : JSON.stringify(result.error as Record<string, unknown>)
              }`}
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <Link href="/" className="px-4 py-2 bg-purple-700 text-white rounded-md inline-block">
          Go to Home
        </Link>

        <button onClick={onReset} className="px-4 py-2 bg-gray-700 text-white rounded-md">
          Scan Another Receipt
        </button>
      </div>
    </div>
  );
};
