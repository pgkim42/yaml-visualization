import { memo, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ToolbarButton = memo(({
  icon: Icon,
  onClick,
  title,
  children,
  disabled = false,
  className = '',
}: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
      hover:bg-gray-100 dark:hover:bg-gray-700
      text-gray-600 dark:text-gray-400 transition-colors
      disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    title={title}
  >
    <Icon className="w-3.5 h-3.5" />
    {children && <span>{children}</span>}
  </button>
));

ToolbarButton.displayName = 'ToolbarButton';
