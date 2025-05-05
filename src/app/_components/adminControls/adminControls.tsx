'use client';

import { makeMeAdmin, seedFridge } from '../../actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const MakeMeAdminButton = ({ email }: { email: string }) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const router = useRouter();

  const handleSeedFridge = async () => {
    try {
      setIsSeeding(true);
      setSeedMessage('Seeding fridge...');
      const result = await seedFridge();
      setSeedMessage(result.message);
      // Refresh the page to show the new items
      router.refresh();
    } catch (error) {
      console.error('Error seeding fridge:', error);
      setSeedMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (email === 'neilfoxholes@hotmail.com') {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => makeMeAdmin({ email })}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Make me admin
        </button>
        <button
          onClick={handleSeedFridge}
          disabled={isSeeding}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded disabled:bg-gray-400"
        >
          {isSeeding ? 'Seeding...' : 'Seed fridge with test data'}
        </button>
        {seedMessage && <p className="text-sm text-gray-600">{seedMessage}</p>}
      </div>
    );
  }
  return null;
};
