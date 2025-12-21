import { ChevronsUpDown, ChevronsDownUp, FolderTree } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SearchBar } from './SearchBar';
import { TreeNode } from './TreeNode';
import { ToolbarButton } from '../common';

export const TreeViewer = () => {
  const { treeData, expandAll, collapseAll, parseError, searchQuery } = useStore();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="h-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 flex items-center gap-1">
        <FolderTree className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
          트리 뷰어
        </span>

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
            <p className="text-sm">YAML 파싱 에러</p>
            <p className="text-xs mt-1 text-red-400">{parseError.message}</p>
          </div>
        ) : treeData ? (
          <div className="py-2">
            <TreeNode node={treeData} searchQuery={searchQuery} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FolderTree className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">YAML을 입력하면 트리가 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
};
