import { memo, useCallback, useMemo, useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
import type { TreeNodeData } from '../../types';
import { useStore } from '../../store/useStore';
import { TypeBadge } from './TypeBadge';
import { LAYOUT } from '../../constants';
import { formatPath } from '../../utils/pathUtils';
import { copyToClipboard } from '../../utils/fileUtils';

interface TreeNodeProps {
  node: TreeNodeData;
  searchQuery?: string;
}

// 값을 표시 문자열로 변환
const formatValue = (value: unknown, type: TreeNodeData['type']): string => {
  if (type === 'null') return 'null';
  if (type === 'boolean') return String(value);
  if (type === 'number') return String(value);
  if (type === 'string') return `"${value}"`;
  if (type === 'array') return `[${(value as unknown[]).length}]`;
  if (type === 'object') return `{${Object.keys(value as object).length}}`;
  return String(value);
};

// 검색어 하이라이팅
const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
};

export const TreeNode = memo(({ node, searchQuery = '' }: TreeNodeProps) => {
  const { expandedNodes, toggleNode, selectedPath, setSelectedPath, searchResults, addToast } = useStore();
  const [copied, setCopied] = useState(false);

  const isExpanded = useMemo(() => expandedNodes.has(node.path), [expandedNodes, node.path]);
  const hasChildren = useMemo(() => node.children.length > 0, [node.children.length]);
  const isSelected = selectedPath === node.path;
  const isSearchMatch = useMemo(
    () => searchResults.includes(node.path),
    [searchResults, node.path]
  );

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.children.length > 0) {
      toggleNode(node.path);
    }
  }, [node.children.length, node.path, toggleNode]);

  const handleSelect = useCallback(() => {
    setSelectedPath(node.path);
  }, [node.path, setSelectedPath]);

  // 경로 복사 핸들러
  const handleCopyPath = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Shift 키를 누르면 배열 표기법, 아니면 점 표기법
    const format = e.shiftKey ? 'bracket' : 'dot';
    const formattedPath = formatPath(node.path, format);
    
    if (!formattedPath) {
      addToast('루트 노드는 복사할 수 없습니다', 'error');
      return;
    }
    
    const success = await copyToClipboard(formattedPath);
    
    if (success) {
      setCopied(true);
      addToast(`경로 복사됨: ${formattedPath}`, 'success');
      setTimeout(() => setCopied(false), 1000);
    } else {
      addToast('복사 실패', 'error');
    }
  }, [node.path, addToast]);

  // 들여쓰기
  const indent = node.depth * LAYOUT.TREE_INDENT_PX;

  return (
    <div>
      {/* 노드 행 */}
      <div
        onClick={handleSelect}
        className={`
          group flex items-center gap-1.5 py-1 px-2 cursor-pointer
          hover:bg-gray-100 dark:hover:bg-gray-700
          ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
          ${isSearchMatch ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
        `}
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        {/* 펼침/접힘 아이콘 */}
        <button
          onClick={handleToggle}
          className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${
            hasChildren ? 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300' : 'invisible'
          }`}
        >
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )
          )}
        </button>

        {/* 키 이름 */}
        {node.key !== 'root' && (
          <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
            {highlightText(node.key, searchQuery)}
            <span className="text-gray-400">:</span>
          </span>
        )}

        {/* 값 (리프 노드일 때만) */}
        {!hasChildren && (
          <span className={`text-sm ${
            node.type === 'string' ? 'text-green-600 dark:text-green-400' :
            node.type === 'number' ? 'text-blue-600 dark:text-blue-400' :
            node.type === 'boolean' ? 'text-purple-600 dark:text-purple-400' :
            node.type === 'null' ? 'text-gray-500' :
            'text-gray-600 dark:text-gray-300'
          }`}>
            {highlightText(formatValue(node.value, node.type), searchQuery)}
          </span>
        )}

        {/* 타입 배지 */}
        <TypeBadge type={node.type} />

        {/* 배열/객체 카운트 */}
        {hasChildren && (
          <span className="text-xs text-gray-400">
            {node.type === 'array'
              ? `${node.children.length} items`
              : `${node.children.length} keys`
            }
          </span>
        )}

        {/* 복사 버튼 - 호버 시만 표시 (root 노드 제외) */}
        {node.key !== 'root' && (
          <button
            onClick={handleCopyPath}
            title="경로 복사 (Shift+클릭: 배열 표기법)"
            className={`
              ml-auto p-1 rounded transition-opacity
              ${copied 
                ? 'opacity-100 text-green-500' 
                : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* 자식 노드들 */}
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';
