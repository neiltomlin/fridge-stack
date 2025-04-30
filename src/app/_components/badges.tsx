import dayjs from 'dayjs';

interface CategoryBadgeProps {
  category: string | null;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const displayText =
    (category ?? 'unknown').charAt(0).toUpperCase() + (category ?? 'unknown').slice(1);

  return (
    <span className="inline-block px-2 py-1 rounded-full text-sm bg-gray-800">{displayText}</span>
  );
};

interface ExpiryBadgeProps {
  date: Date | null;
}

export const ExpiryBadge = ({ date }: ExpiryBadgeProps) => {
  if (!date) {
    return <span className="inline-block px-2 py-1 rounded-full text-sm bg-gray-800">No date</span>;
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

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm ${getExpiryStyle()}`}>
      {dayjs(date).format('D MMM')}
    </span>
  );
};
