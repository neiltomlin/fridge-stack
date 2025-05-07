'use client';
import { emptyFridge } from '../../actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const EmptyFridgeButton = () => {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const emptyFridgeHandler = async () => {
    try {
      await emptyFridge();
      router.refresh();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Failed to empty fridge:', error);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {!showConfirmation ? (
        <button
          className="bg-red-700 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-red-900 border-solid border-gray-100 border-1 hover:border-transparent"
          onClick={() => setShowConfirmation(true)}
        >
          Empty Fridge
        </button>
      ) : (
        <div className="bg-gray-800 p-4 rounded-md text-center">
          <p className="mb-3">Are you sure you want to remove all items from your fridge?</p>
          <div className="flex justify-center gap-3">
            <button
              className="bg-red-700 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-red-900 border-solid border-gray-100 border-1 hover:border-transparent"
              onClick={emptyFridgeHandler}
            >
              Yes, Empty Everything
            </button>
            <button
              className="bg-gray-700 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-gray-900 border-solid border-gray-100 border-1 hover:border-transparent"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
