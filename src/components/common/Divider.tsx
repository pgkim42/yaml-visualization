type DividerOrientation = 'vertical' | 'horizontal';

interface DividerProps {
  orientation?: DividerOrientation;
  className?: string;
}

export const Divider = ({ orientation = 'vertical', className = '' }: DividerProps) => (
  <div
    className={`
      ${orientation === 'vertical' ? 'w-px h-5' : 'h-px w-full'}
      bg-gray-200 dark:bg-gray-700/50
      ${orientation === 'vertical' ? 'mx-2' : 'my-2'}
      ${className}
    `}
  />
);
