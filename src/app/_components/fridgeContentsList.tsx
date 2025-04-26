import { api } from '~/trpc/server';
import { deleteFromFridge } from '../actions';
import dayjs from 'dayjs';
import { DeleteFromFridgeButton } from './deleteFromFridgeButton';

export const FridgeContentsList = async () => {
  const contentsQuery = await api.contents.getAll();

  return (
    <ul>
      {contentsQuery.map((item) => (
        <li key={item.id}>
          {item.name}, {item.category}, {dayjs(item.expiryDate).format('D MMM')}
          <DeleteFromFridgeButton id={item.id} />
        </li>
      ))}
    </ul>
  );
};
