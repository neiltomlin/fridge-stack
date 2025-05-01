export const FRIDGE_CATEGORIES = [
  'beverage',
  'bread',
  'cheese',
  'condiments',
  'cooking sauces',
  'dairy',
  'deli',
  'desserts',
  'eggs',
  'fruit',
  'herbs',
  'leftovers',
  'meat',
  'prepared meals',
  'seafood',
  'snacks',
  'vegetable',
  'miscellaneous',
] as const;

export type FridgeCategory = (typeof FRIDGE_CATEGORIES)[number];
