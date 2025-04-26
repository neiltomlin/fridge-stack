'use client';
import { deleteFromFridge } from '../actions';

export const DeleteFromFridgeButton = ({ id }: { id: number }) => {
  return (
    <button className="bg-red-500 px-2 py-1 rounded-xl" onClick={() => deleteFromFridge({ id })}>
      Delete
    </button>
  );
};
