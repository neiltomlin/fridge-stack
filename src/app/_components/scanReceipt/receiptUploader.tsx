'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ReceiptUploaderProps {
  image: string | null;
  fileName: string;
  isProcessing: boolean;
  error: string | null;
  reviewItemsLength: number;
  onImageUpload: (base64: string | null, fileName: string) => void;
  onProcessReceipt: () => Promise<void>;
  onReset: () => void;
}

export const ReceiptUploader = ({
  image,
  fileName,
  isProcessing,
  error,
  reviewItemsLength,
  onImageUpload,
  onProcessReceipt,
  onReset,
}: ReceiptUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onImageUpload(null, '');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = (event.target.result as string).split(',')[1];
        if (base64) {
          onImageUpload(base64, file.name);
        } else {
          onImageUpload(null, '');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-8 p-6 rounded-lg shadow-lg">
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
          onClick={onProcessReceipt}
          disabled={!image || isProcessing}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md disabled:opacity-50"
        >
          {isProcessing && !reviewItemsLength ? 'Processing...' : 'Scan Receipt'}
        </button>

        <button onClick={onReset} className="px-4 py-2 bg-gray-700 text-white rounded-md">
          Reset
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
