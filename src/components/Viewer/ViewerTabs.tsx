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
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentViewer === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setCurrentViewer(tab.id)}
            className={`
              flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors
              border-b-2 -mb-px
              ${isActive
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
