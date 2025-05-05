'use client';

import { useState } from 'react';
import {
  scanReceipt,
  addExtractedItemsToFridge,
  type ExtractedIngredient,
  type OpenAIReceiptResponse,
} from '../actions';
import { type FridgeCategory } from '../constants';
import ScanReceiptAdminControls from '../_components/adminControls/scanReceiptAdminControls';
import { ReceiptUploader } from '../_components/scanReceipt/receiptUploader';
import { ReviewItemsTable } from '../_components/scanReceipt/reviewItemsTable';
import { AddedItemsResult } from '../_components/scanReceipt/addedItemsResult';
import { type ReviewItem, type AddedItemResult } from '../_components/scanReceipt/types';

export default function ScanReceiptPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [addedItems, setAddedItems] = useState<AddedItemResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64: string | null, name: string) => {
    setImage(base64);
    setFileName(name);
    setError(null);
    setReviewItems([]);
    setAddedItems([]);

    if (!base64 && name === '') {
      setError('File size too large. Please upload an image less than 5MB.');
    }
  };

  const resetForm = () => {
    setImage(null);
    setFileName('');
    setReviewItems([]);
    setAddedItems([]);
    setError(null);
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
      // Toggle between food and non-food status
      updatedItems[index] = {
        ...currentItem,
        isFood: value as boolean,

        // When switching to food type, ensure it has a valid category
        category: value === true ? currentItem.category || 'miscellaneous' : currentItem.category,
      };
    } else {
      // Handle updates for all other fields
      let fieldValue;

      // Determine the appropriate value based on field type
      if (field === 'category') {
        // Category fields use the value directly
        fieldValue = value;
      } else if (field === 'quantity' || field === 'expiryDays') {
        // Numeric fields need conversion from string inputs
        fieldValue = Number(value);
      } else {
        // String fields (like name) with fallback for empty values
        fieldValue = (value as string) || 'Unnamed Item';
      }

      // Update the item with the new field value
      updatedItems[index] = {
        ...currentItem,
        [field]: fieldValue,
      };
    }

    setReviewItems(updatedItems);
  };

  const handleMockData = (mockData: OpenAIReceiptResponse) => {
    const foodItems = mockData.foodItems.map((item) => ({
      name: item.item,
      originalName: item.receiptName,
      category: item.category as FridgeCategory,
      quantity: Number(item.quantity) || 1,
      expiryDays: item.expiresIn,
      isFood: true,
    }));

    const nonFoodItems = mockData.nonFoodItems.map((item) => ({
      name: item.item,
      originalName: item.item,
      category: 'miscellaneous' as FridgeCategory,
      quantity: 1,
      expiryDays: 14,
      isFood: false,
    }));

    setReviewItems([...foodItems, ...nonFoodItems]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Scan Supermarket Receipt</h1>

        <ScanReceiptAdminControls onMockData={handleMockData} />

        <ReceiptUploader
          image={image}
          fileName={fileName}
          isProcessing={isProcessing}
          error={error}
          reviewItemsLength={reviewItems.length}
          onImageUpload={handleImageUpload}
          onProcessReceipt={handleProcessReceipt}
          onReset={resetForm}
        />

        <ReviewItemsTable
          reviewItems={reviewItems}
          isProcessing={isProcessing}
          onEditItem={handleEditItem}
          onAddToFridge={handleAddToFridge}
        />

        <AddedItemsResult addedItems={addedItems} onReset={resetForm} />
      </div>
    </main>
  );
}
