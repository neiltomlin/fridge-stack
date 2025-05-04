'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { scanReceipt, addExtractedItemsToFridge, type ExtractedIngredient } from '../actions';
import { FRIDGE_CATEGORIES, type FridgeCategory } from '../constants';
import Link from 'next/link';

type ReviewItem = ExtractedIngredient & {
  originalName: string;
  isFood: boolean;
};

export default function ScanReceiptPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [addedItems, setAddedItems] = useState<
    { success: boolean; item: string; error?: unknown }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setReviewItems([]);
    setAddedItems([]);

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please upload an image less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = (event.target.result as string).split(',')[1];
        if (base64) {
          setImage(base64);
        } else {
          setImage(null);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setImage(null);
    setFileName('');
    setReviewItems([]);
    setAddedItems([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcessReceipt = async () => {
    if (!image) {
      setError('Please upload a receipt image first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await scanReceipt(image);

      // Convert OpenAIReceiptResponse to ReviewItems
      const foodItems = response.foodItems.map((item) => ({
        name: item.item,
        originalName: item.receiptName,
        category: item.category as FridgeCategory,
        quantity: Number(item.quantity) || 1,
        expiryDays: item.expiresIn,
        isFood: true,
      }));

      const nonFoodItems = response.nonFoodItems.map((item) => ({
        name: item.item,
        originalName: item.item,
        category: 'miscellaneous' as FridgeCategory,
        quantity: 1,
        expiryDays: 14,
        isFood: false,
      }));

      setReviewItems([...foodItems, ...nonFoodItems]);
    } catch (err) {
      console.error('Error processing receipt:', err);
      setError(err instanceof Error ? err.message : 'Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToFridge = async () => {
    // Filter out non-food items
    const foodItemsToAdd = reviewItems.filter((item) => item.isFood);

    if (foodItemsToAdd.length === 0) {
      setError('No food items to add to your fridge.');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert ReviewItems to ExtractedIngredient
      const itemsToAdd: ExtractedIngredient[] = foodItemsToAdd.map((item) => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        expiryDays: item.expiryDays,
      }));

      const results = await addExtractedItemsToFridge(itemsToAdd);
      setAddedItems(results);
    } catch (err) {
      console.error('Error adding items to fridge:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to add items to your fridge. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditItem = (
    index: number,
    field: keyof ReviewItem,
    value: string | number | boolean
  ) => {
    const updatedItems = [...reviewItems];
    const currentItem = updatedItems[index];

    if (field === 'isFood') {
      // Toggle between food and non-food
      updatedItems[index] = {
        ...currentItem,
        isFood: value as boolean,
        // If switching to food, ensure it has a valid category
        category: value === true ? currentItem.category || 'miscellaneous' : currentItem.category,
      };
    } else {
      updatedItems[index] = {
        ...currentItem,
        [field]:
          field === 'category'
            ? value
            : field === 'quantity' || field === 'expiryDays'
              ? Number(value)
              : (value as string) || 'Unnamed Item',
      };
    }

    setReviewItems(updatedItems);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Scan Supermarket Receipt</h1>

      <div className="mb-8 p-6 bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upload Receipt Image</h2>

        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {fileName && <p className="mt-2 text-sm text-gray-300">Selected file: {fileName}</p>}
        </div>

        {image && (
          <div className="mb-4">
            <p className="mb-2 font-medium">Receipt Preview:</p>
            <div className="relative h-64 w-full md:w-1/2 bg-gray-900 rounded-md overflow-hidden">
              <Image
                src={`data:image/jpeg;base64,${image}`}
                alt="Receipt preview"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleProcessReceipt}
            disabled={!image || isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md disabled:opacity-50"
          >
            {isProcessing && !reviewItems.length ? 'Processing...' : 'Scan Receipt'}
          </button>

          <button onClick={resetForm} className="px-4 py-2 bg-gray-700 text-white rounded-md">
            Reset
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-md">
            {error}
          </div>
        )}
      </div>

      {reviewItems.length > 0 && (
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
              onClick={handleAddToFridge}
              disabled={isProcessing || reviewItems.filter((item) => item.isFood).length === 0}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md disabled:opacity-50"
            >
              {isProcessing && addedItems.length === 0
                ? 'Adding...'
                : 'Add All Food Items to Fridge'}
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
                        onChange={(e) => handleEditItem(index, 'name', e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-400 text-sm">{item.originalName}</td>
                    <td className="px-4 py-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isFood}
                          onChange={(e) => handleEditItem(index, 'isFood', e.target.checked)}
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
                        onChange={(e) => handleEditItem(index, 'category', e.target.value)}
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
                        onChange={(e) => handleEditItem(index, 'quantity', e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                        disabled={!item.isFood}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.expiryDays ?? ''}
                        onChange={(e) => handleEditItem(index, 'expiryDays', e.target.value)}
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
      )}

      {addedItems.length > 0 && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Items Added to Fridge</h2>

          <div className="space-y-2 mb-6">
            {addedItems.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded ${result.success ? 'bg-green-900/30 border border-green-500 text-green-300' : 'bg-red-900/30 border border-red-500 text-red-300'}`}
              >
                {result.success ? '✓ ' : '✗ '}
                {result.item}{' '}
                {!result.success &&
                  result.error &&
                  `- Error: ${typeof result.error === 'string' ? result.error : JSON.stringify(result.error as Record<string, unknown>)}`}
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <Link href="/" className="px-4 py-2 bg-purple-700 text-white rounded-md inline-block">
              Go to Home
            </Link>

            <button onClick={resetForm} className="px-4 py-2 bg-gray-700 text-white rounded-md">
              Scan Another Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
