import type { FridgeCategory } from '~/app/constants';
import { addDaysToNow } from './seed';

// Create one item for each category with realistic data
const itemsToInsert = [
  // Meat - 3+ items
  {
    name: 'Chicken breasts',
    category: 'meat' as FridgeCategory,
    quantity: 2,
    expiryDate: addDaysToNow(5),
  },
  {
    name: 'Ground beef',
    category: 'meat' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(-1), // Already expired
  },
  {
    name: 'Pork chops',
    category: 'meat' as FridgeCategory,
    quantity: 4,
    expiryDate: addDaysToNow(4),
  },
  {
    name: 'Turkey slices',
    category: 'meat' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(6),
  },

  // Dairy - 3+ items
  {
    name: 'Whole milk',
    category: 'dairy' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(7),
  },
  {
    name: 'Yogurt',
    category: 'dairy' as FridgeCategory,
    quantity: 4,
    expiryDate: addDaysToNow(2), // Expiring soon
  },
  {
    name: 'Heavy cream',
    category: 'dairy' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(5),
  },
  {
    name: 'Butter',
    category: 'dairy' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(14),
  },

  // Fruit - 3+ items
  {
    name: 'Strawberries',
    category: 'fruit' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(3),
  },
  {
    name: 'Blueberries',
    category: 'fruit' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(4),
  },
  {
    name: 'Apples',
    category: 'fruit' as FridgeCategory,
    quantity: 6,
    expiryDate: addDaysToNow(10),
  },
  {
    name: 'Bananas',
    category: 'fruit' as FridgeCategory,
    quantity: 5,
    expiryDate: addDaysToNow(5),
  },

  // Vegetable - 3+ items
  {
    name: 'Broccoli',
    category: 'vegetable' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(4),
  },
  {
    name: 'Spinach',
    category: 'vegetable' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(3),
  },
  {
    name: 'Carrots',
    category: 'vegetable' as FridgeCategory,
    quantity: 8,
    expiryDate: addDaysToNow(14),
  },
  {
    name: 'Bell peppers',
    category: 'vegetable' as FridgeCategory,
    quantity: 3,
    expiryDate: addDaysToNow(7),
  },

  // Beverage
  {
    name: 'Orange juice',
    category: 'beverage' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(10),
  },
  {
    name: 'Oat milk',
    category: 'beverage' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(14),
  },
  {
    name: 'Iced tea',
    category: 'beverage' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(7),
  },

  // Condiments
  {
    name: 'Mayonnaise',
    category: 'condiments' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(90), // Condiments last longer
  },
  {
    name: 'Mustard',
    category: 'condiments' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(120),
  },
  {
    name: 'Ketchup',
    category: 'condiments' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(100),
  },

  // Cooking sauces
  {
    name: 'Tomato pasta sauce',
    category: 'cooking sauces' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(14),
  },
  {
    name: 'Curry paste',
    category: 'cooking sauces' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(30),
  },

  // Leftovers
  {
    name: 'Leftover pizza',
    category: 'leftovers' as FridgeCategory,
    quantity: 3,
    expiryDate: addDaysToNow(2),
  },
  {
    name: 'Leftover pasta',
    category: 'leftovers' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(3),
  },

  // Desserts
  {
    name: 'Chocolate mousse',
    category: 'desserts' as FridgeCategory,
    quantity: 2,
    expiryDate: addDaysToNow(4),
  },
  {
    name: 'Cheesecake',
    category: 'desserts' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(5),
  },

  // Seafood
  {
    name: 'Salmon fillets',
    category: 'seafood' as FridgeCategory,
    quantity: 2,
    expiryDate: addDaysToNow(1), // Fish expires quickly
  },
  {
    name: 'Shrimp',
    category: 'seafood' as FridgeCategory,
    quantity: 12,
    expiryDate: addDaysToNow(2),
  },

  // Eggs
  {
    name: 'Free-range eggs',
    category: 'eggs' as FridgeCategory,
    quantity: 12,
    expiryDate: addDaysToNow(21),
  },
  {
    name: 'Duck eggs',
    category: 'eggs' as FridgeCategory,
    quantity: 6,
    expiryDate: addDaysToNow(18),
  },

  // Cheese
  {
    name: 'Cheddar cheese',
    category: 'cheese' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(30),
  },
  {
    name: 'Brie',
    category: 'cheese' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(7),
  },
  {
    name: 'Mozzarella',
    category: 'cheese' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(10),
  },

  // Bread
  {
    name: 'Sourdough loaf',
    category: 'bread' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(5),
  },
  {
    name: 'Bagels',
    category: 'bread' as FridgeCategory,
    quantity: 6,
    expiryDate: addDaysToNow(7),
  },

  // Herbs
  {
    name: 'Fresh basil',
    category: 'herbs' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(4),
  },
  {
    name: 'Cilantro',
    category: 'herbs' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(3),
  },

  // Deli
  {
    name: 'Sliced ham',
    category: 'deli' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(5),
  },
  {
    name: 'Salami',
    category: 'deli' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(14),
  },

  // Prepared meals
  {
    name: 'Ready meal - Lasagna',
    category: 'prepared meals' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(5),
  },
  {
    name: 'Frozen curry',
    category: 'prepared meals' as FridgeCategory,
    quantity: 2,
    expiryDate: addDaysToNow(60),
  },

  // Snacks
  {
    name: 'Hummus',
    category: 'snacks' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(7),
  },
  {
    name: 'Guacamole',
    category: 'snacks' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(2),
  },

  // Miscellaneous
  {
    name: 'Tofu',
    category: 'miscellaneous' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(10),
  },
  {
    name: 'Seitan',
    category: 'miscellaneous' as FridgeCategory,
    quantity: 1,
    expiryDate: addDaysToNow(14),
  },
];

export const getItemsToInsert = (userId: string) => {
  return itemsToInsert.map((item) => ({
    ...item,
    addedById: userId,
  }));
};
