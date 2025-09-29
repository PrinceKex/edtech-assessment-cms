import { ReactNode } from 'react';

interface TabProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}

export function Tab({ children, active, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-teal-50 text-teal-700 border border-teal-200'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

interface TabsProps {
  children: ReactNode;
  className?: string;
}

export function Tabs({ children, className = '' }: TabsProps) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {children}
    </div>
  );
}
