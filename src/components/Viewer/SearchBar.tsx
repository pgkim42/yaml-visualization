import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { TreeNodeData } from '../../types';
import { getParentPaths } from '../../utils/pathUtils';

// 트리에서 검색어와 매칭되는 노드 경로들 찾기
const findMatchingPaths = (
  node: TreeNodeData | null,
  query: string
): string[] => {
  if (!node || !query) return [];

  const results: string[] = [];
  const lowerQuery = query.toLowerCase();

  const search = (n: TreeNodeData) => {
    // 키 검색
    if (n.key.toLowerCase().includes(lowerQuery)) {
      results.push(n.path);
    }
    // 값 검색 (리프 노드 - children이 빈 배열)
    else if (
      n.children.length === 0 &&
      String(n.value).toLowerCase().includes(lowerQuery)
    ) {
      results.push(n.path);
    }

    // 자식 노드 검색
    n.children.forEach(search);
  };

  search(node);
  return results;
};

export const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    treeData,
    setSelectedPath,
    expandedNodes,
    toggleNode,
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  // 검색 결과 메모이제이션
  const computedResults = useMemo(
    () => findMatchingPaths(treeData, searchQuery),
    [treeData, searchQuery]
  );

  // 검색 결과 업데이트
  useEffect(() => {
    setSearchResults(computedResults);
    setCurrentIndex(0);
  }, [computedResults, setSearchResults]);

  // 검색 결과로 이동 시 부모 노드들 펼치기
  const expandParents = useCallback(
    (path: string) => {
      const parentPaths = getParentPaths(path);
      parentPaths.forEach((parentPath) => {
        if (!expandedNodes.has(parentPath)) {
          toggleNode(parentPath);
        }
      });
    },
    [expandedNodes, toggleNode]
  );

  // 이전/다음 검색 결과로 이동
  const goToResult = useCallback(
    (index: number) => {
      if (searchResults.length === 0) return;

      const newIndex =
        (index + searchResults.length) % searchResults.length;
      setCurrentIndex(newIndex);

      const path = searchResults[newIndex];
      expandParents(path);
      setSelectedPath(path);
    },
    [searchResults, expandParents, setSelectedPath]
  );

  const handlePrev = () => goToResult(currentIndex - 1);
  const handleNext = () => goToResult(currentIndex + 1);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* 검색 아이콘 */}
      <Search className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />

      {/* 검색 입력 */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="flex-1 min-w-0 bg-transparent text-xs text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600 outline-none"
      />

      {/* 검색 결과 카운트 & 네비게이션 */}
      {searchQuery && (
        <>
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap font-medium">
            {searchResults.length > 0
              ? `${currentIndex + 1}/${searchResults.length}`
              : '0'}
          </span>

          <div className="flex items-center">
            <button
              onClick={handlePrev}
              disabled={searchResults.length === 0}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
              title="이전 (Shift+Enter)"
            >
              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button
              onClick={handleNext}
              disabled={searchResults.length === 0}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
              title="다음 (Enter)"
            >
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="지우기 (Esc)"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </>
      )}
    </div>
  );
};
