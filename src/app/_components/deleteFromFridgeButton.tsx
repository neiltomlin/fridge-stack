'use client';
import { deleteFromFridge } from '../actions';
import { useRouter } from 'next/navigation';

export const DeleteFromFridgeButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const deleteClickHandler = async () => {
    await deleteFromFridge({ id });
    router.refresh();
  };
  return (
    <button className="bg-red-500 px-2 py-1 rounded-xl" onClick={deleteClickHandler}>
      Delete
    </button>
  );
};
