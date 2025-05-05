'use client';
import { deleteFromFridge } from '../../actions';
import { useRouter } from 'next/navigation';

export const DeleteFromFridgeButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const deleteClickHandler = async () => {
    await deleteFromFridge({ id });
    router.refresh();
  };
  return (
    <>
      <button
        className="bg-green-700 px-2 py-1 mr-2 rounded-md hover:bg-green-900 cursor-pointer border-solid border-gray-100 border-1 hover:border-transparent"
        onClick={deleteClickHandler}
      >
        Used it 😁
      </button>
      <button
        className="bg-red-700 px-2 py-1 rounded-md hover:bg-red-900 cursor-pointer border-solid border-gray-100 border-1 hover:border-transparent"
        onClick={deleteClickHandler}
      >
        Threw it away 😖
      </button>
    </>
  );
};
