import { ChevronsUpDown, ChevronsDownUp, FolderTree } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SearchBar } from './SearchBar';
import { TreeNode } from './TreeNode';
import { ToolbarButton } from '../common';

export const TreeViewer = () => {
  const { treeData, expandAll, collapseAll, parseError, searchQuery } = useStore();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* 툴바 */}
      <div className="h-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 flex items-center gap-1">
        <div className="flex-1" />

        <ToolbarButton icon={ChevronsUpDown} onClick={expandAll} title="전체 펼치기">
          펼치기
        </ToolbarButton>

        <ToolbarButton icon={ChevronsDownUp} onClick={collapseAll} title="전체 접기">
          접기
        </ToolbarButton>
      </div>

      {/* 검색바 */}
      <SearchBar />

      {/* 트리 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        {parseError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <p className="text-xs font-medium">YAML 파싱 에러</p>
            <p className="text-xs mt-1 text-red-400">{parseError.message}</p>
          </div>
        ) : treeData ? (
          <div className="py-2">
            <TreeNode node={treeData} searchQuery={searchQuery} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600">
            <FolderTree className="w-10 h-10 mb-3" />
            <p className="text-xs">YAML을 입력하면 트리가 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
};
