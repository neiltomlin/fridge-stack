'use client';
import { useState } from 'react';
import { addToFridge } from '../actions';
import { useRouter } from 'next/navigation';
import { FRIDGE_CATEGORIES, type FridgeCategory } from '../constants';

export const AddToFridge = () => {
  const [toAdd, setToAdd] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState<FridgeCategory>(FRIDGE_CATEGORIES[0]);

  const router = useRouter();

  const addToFridgeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addToFridge({
        name: toAdd,
        category: category,
        expiryDate: new Date(expiryDate),
      });
      setToAdd('');
      setExpiryDate('');
      router.refresh();
    } catch (error) {
      console.error('Failed to add item to fridge:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div>
      <form onSubmit={addToFridgeHandler} className="flex gap-2 items-center">
        <input
          type="text"
          value={toAdd}
          onChange={(e) => setToAdd(e.target.value)}
          placeholder="Add item to fridge"
          className="border rounded px-2 py-1 [color-scheme:dark]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as FridgeCategory)}
          className="border rounded px-2 py-1 [color-scheme:dark]"
          required
        >
          {FRIDGE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="[color-scheme:dark]">
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border rounded px-2 py-1 [color-scheme:dark]"
          required
        />
        <button className="bg-green-500 px-2 py-1 rounded-xl text-white" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};
