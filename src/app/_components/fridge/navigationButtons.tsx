'use client';
import Link from 'next/link';

type NavigationButtonsProps = {
  className?: string;
};

export const NavigationButtons = ({ className = '' }: NavigationButtonsProps) => {
  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      <Link
        href="/scan-receipt"
        className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90 transition-all"
      >
        🧾 Scan Supermarket Receipt
      </Link>
      {/* Additional navigation buttons can be added here */}
    </div>
  );
};
