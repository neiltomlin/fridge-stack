'use client';

import { useState } from 'react';
import { type OpenAIReceiptResponse } from '../../actions';
import { useSession } from 'next-auth/react';

interface ScanReceiptAdminControlsProps {
  onMockData: (mockData: OpenAIReceiptResponse) => void;
}

const ScanReceiptAdminControls = ({ onMockData }: ScanReceiptAdminControlsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data } = useSession();

  // Check if user should have admin access (using the same check as in adminControls.tsx)
  if (data?.user?.email !== 'neilfoxholes@hotmail.com') {
    return null;
  }

  // Mock data for testing
  const generateMockData = (type: 'basic' | 'complex' | 'empty') => {
    setIsGenerating(true);

    let mockData: OpenAIReceiptResponse;

    switch (type) {
      case 'basic':
        mockData = {
          foodItems: [
            {
              item: 'Milk',
              receiptName: 'ORGANIC MILK 2L',
              quantity: '1',
              expiresIn: 7,
              category: 'dairy',
            },
            {
              item: 'Bread',
              receiptName: 'SOURDOUGH LOAF',
              quantity: '1',
              expiresIn: 5,
              category: 'bread',
            },
            {
              item: 'Apples',
              receiptName: 'GALA APPLES 4PK',
              quantity: '1',
              expiresIn: 14,
              category: 'fruit',
            },
          ],
          nonFoodItems: [{ item: 'Paper Towels' }, { item: 'Dish Soap' }],
        };
        break;

      case 'complex':
        mockData = {
          foodItems: [
            {
              item: 'Organic Milk',
              receiptName: 'ORG MILK 2%',
              quantity: '2',
              expiresIn: 7,
              category: 'dairy',
            },
            {
              item: 'Sourdough Bread',
              receiptName: 'ARTISAN SDOUGH',
              quantity: '1',
              expiresIn: 4,
              category: 'bread',
            },
            {
              item: 'Fresh Salmon',
              receiptName: 'ATLANTIC SALMON',
              quantity: '1',
              expiresIn: 2,
              category: 'seafood',
            },
            {
              item: 'Spinach',
              receiptName: 'ORG BABY SPINACH',
              quantity: '1',
              expiresIn: 5,
              category: 'vegetable',
            },
            {
              item: 'Cheddar Cheese',
              receiptName: 'SHARP CHEDDAR 8OZ',
              quantity: '1',
              expiresIn: 14,
              category: 'cheese',
            },
            {
              item: 'Yogurt',
              receiptName: 'GRK YOGURT PLAIN',
              quantity: '4',
              expiresIn: 10,
              category: 'dairy',
            },
            {
              item: 'Pasta Sauce',
              receiptName: 'MARINARA SAUCE',
              quantity: '1',
              expiresIn: 30,
              category: 'cooking sauces',
            },
            {
              item: 'Chicken Breast',
              receiptName: 'CHICKEN BREAST 1LB',
              quantity: '2',
              expiresIn: 3,
              category: 'meat',
            },
          ],
          nonFoodItems: [
            { item: 'Laundry Detergent' },
            { item: 'Toilet Paper' },
            { item: 'Shampoo' },
            { item: 'Batteries' },
          ],
        };
        break;

      case 'empty':
        mockData = {
          foodItems: [],
          nonFoodItems: [],
        };
        break;

      default:
        mockData = {
          foodItems: [],
          nonFoodItems: [],
        };
    }

    setTimeout(() => {
      onMockData(mockData);
      setIsGenerating(false);
    }, 500); // Small delay to simulate processing
  };

  return (
    <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
      <p className="mb-3 text-sm text-gray-300">
        Generate mock receipt data for testing without uploading an image.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => generateMockData('basic')}
          disabled={isGenerating}
          className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          Basic Mock Data (3 items)
        </button>
        <button
          onClick={() => generateMockData('complex')}
          disabled={isGenerating}
          className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          Complex Mock Data (12 items)
        </button>
        <button
          onClick={() => generateMockData('empty')}
          disabled={isGenerating}
          className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          Empty Mock Data
        </button>
      </div>
    </div>
  );
};

export default ScanReceiptAdminControls;
