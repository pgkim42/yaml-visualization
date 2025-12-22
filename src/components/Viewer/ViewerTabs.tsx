import { FolderTree, LayoutGrid, Sun, GitBranch } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ViewerType } from '../../types';

interface TabConfig {
  id: ViewerType;
  label: string;
  icon: typeof FolderTree;
}

const tabs: TabConfig[] = [
  { id: 'tree', label: '트리', icon: FolderTree },
  { id: 'treemap', label: '트리맵', icon: LayoutGrid },
  { id: 'sunburst', label: '선버스트', icon: Sun },
  { id: 'mindmap', label: '마인드맵', icon: GitBranch },
];

export const ViewerTabs = () => {
  const { currentViewer, setCurrentViewer } = useStore();

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentViewer === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setCurrentViewer(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all
              ${isActive
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
