import { type FridgeCategory } from '../../constants';

export type ReviewItem = {
  name: string;
  originalName: string;
  category: FridgeCategory;
  quantity: number;
  expiryDays?: number;
  isFood: boolean;
};

export type AddedItemResult = {
  success: boolean;
  item: string;
  error?: unknown;
};
