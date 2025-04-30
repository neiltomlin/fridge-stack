'use client';

interface QuantityBadgeProps {
  quantity: number;
}

export const QuantityBadge = ({ quantity }: QuantityBadgeProps) => {
  const getQuantityStyle = () => {
    if (quantity <= 1) {
      return 'bg-red-100 text-red-800';
    }
    if (quantity <= 3) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm ${getQuantityStyle()}`}>
      {quantity} {quantity === 1 ? 'item' : 'items'}
    </span>
  );
};
