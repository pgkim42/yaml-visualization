import type { TreeNodeData } from '../../types';

interface TypeBadgeProps {
  type: TreeNodeData['type'];
}

const typeConfig: Record<TreeNodeData['type'], { label: string; className: string }> = {
  string: {
    label: 'str',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  number: {
    label: 'num',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  boolean: {
    label: 'bool',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  null: {
    label: 'null',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  array: {
    label: 'array',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  },
  object: {
    label: 'obj',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
};

export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const config = typeConfig[type];

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded ${config.className}`}
    >
      {config.label}
    </span>
  );
};
