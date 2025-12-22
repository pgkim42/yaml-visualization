import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  className?: string;
}

export const IconButton = memo(({
  icon: Icon,
  onClick,
  title,
  disabled = false,
  className = '',
}: IconButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
      text-gray-500 dark:text-gray-400 transition-colors
      disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
));

IconButton.displayName = 'IconButton';
