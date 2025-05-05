import dayjs from 'dayjs';
import { type FridgeCategory } from '../../constants';

// Map each category to a unique color class
const categoryColorMap: Record<FridgeCategory, string> = {
  'cooking sauces': 'bg-orange-600 text-white',
  'prepared meals': 'bg-teal-600 text-white',
  beverage: 'bg-cyan-600 text-white',
  bread: 'bg-amber-500 text-white',
  cheese: 'bg-yellow-600 text-white',
  condiments: 'bg-yellow-500 text-white',
  dairy: 'bg-blue-100 text-blue-800',
  deli: 'bg-rose-700 text-white',
  desserts: 'bg-pink-500 text-white',
  eggs: 'bg-yellow-300 text-yellow-900',
  fruit: 'bg-purple-500 text-white',
  herbs: 'bg-emerald-600 text-white',
  leftovers: 'bg-amber-700 text-white',
  meat: 'bg-red-700 text-white',
  miscellaneous: 'bg-gray-500 text-white',
  seafood: 'bg-blue-600 text-white',
  snacks: 'bg-indigo-500 text-white',
  vegetable: 'bg-green-600 text-white',
};

// Fallback color for unknown categories
const defaultCategoryColor = 'bg-gray-800 text-white';

interface CategoryBadgeProps {
  category: string | null;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const displayText =
    (category ?? 'unknown').charAt(0).toUpperCase() + (category ?? 'unknown').slice(1);

  // Get the color class based on the category
  const colorClass =
    category && category in categoryColorMap
      ? categoryColorMap[category as FridgeCategory]
      : defaultCategoryColor;

  return (
    <span className={`inline-block px-2 py-1 rounded-md text-sm text-center ${colorClass} w-full`}>
      {displayText}
    </span>
  );
};

interface ExpiryBadgeProps {
  date: Date | null;
}

export const ExpiryBadge = ({ date }: ExpiryBadgeProps) => {
  if (!date) {
    return (
      <span className="inline-block px-2 py-1 rounded-xs text-sm bg-gray-800 w-full">No date</span>
    );
  }

  const getExpiryStyle = () => {
    if (dayjs(date).isBefore(dayjs(), 'day')) {
      return 'bg-red-100 text-red-800';
    }
    if (dayjs(date).isBefore(dayjs().add(3, 'day'), 'day')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  // Calculate days remaining
  const today = dayjs();
  const expiryDate = dayjs(date);
  const daysRemaining = expiryDate.diff(today, 'day');

  // Format the expiry date as dd/mm
  const formattedDate = expiryDate.format('DD/MM');

  // Create display text with days remaining followed by date
  let displayText = '';
  if (daysRemaining < 0) {
    displayText = `${Math.abs(daysRemaining)}d ago (${formattedDate})`;
  } else if (daysRemaining === 0) {
    displayText = `Today (${formattedDate})`;
  } else {
    displayText = `${daysRemaining}d left (${formattedDate})`;
  }

  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-sm text-center ${getExpiryStyle()} w-full`}
    >
      {displayText}
    </span>
  );
};
