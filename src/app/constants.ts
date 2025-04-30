export const FRIDGE_CATEGORIES = [
  'meat',
  'dairy',
  'fruit',
  'vegetable',
  'beverage',
  'condiments',
  'cooking sauces',
] as const;

export type FridgeCategory = typeof FRIDGE_CATEGORIES[number];
