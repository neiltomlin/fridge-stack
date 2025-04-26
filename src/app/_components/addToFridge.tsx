'use client';
import { useState } from 'react';
import { addToFridge } from '../actions';
import { useRouter } from 'next/navigation';

export const AddToFridge = () => {
  const [toAdd, setToAdd] = useState('');

  const router = useRouter();

  const addToFridgeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addToFridge({
        name: toAdd,
        category: 'mockCategory', // Replace with the actual category
        expiryDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Set expiry date to one week from now
      });
      setToAdd('');
      router.refresh();
    } catch (error) {
      console.error('Failed to add item to fridge:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div>
      <form onSubmit={addToFridgeHandler}>
        <input
          type="text"
          value={toAdd}
          onChange={(e) => setToAdd(e.target.value)}
          placeholder="Add item to fridge"
        />
        <button className="bg-green-500 px-2 py-1 rounded-xl" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};
