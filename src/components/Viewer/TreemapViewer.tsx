import { useMemo } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { LayoutGrid } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { convertToTreemapData, getNodeTypeColor, getNodeTypeColorDark } from '../../utils/visualizationUtils';
import type { NivoTreemapNode } from '../../types';

const TreemapViewer = () => {
  const { treeData, parseError, theme, selectedPath, setSelectedPath, searchResults } = useStore();

  // 트리맵 데이터 변환 (메모이제이션)
  const treemapData = useMemo(() => {
    if (!treeData) return null;
    return convertToTreemapData(treeData);
  }, [treeData]);

  // 노드 색상 결정
  const getColor = (node: { data: NivoTreemapNode }) => {
    const isSearchMatch = searchResults.includes(node.data.path);
    const isSelected = selectedPath === node.data.path;

    if (isSearchMatch) return '#fbbf24'; // yellow-400
    if (isSelected) return '#3b82f6'; // blue-500

    return theme === 'dark'
      ? getNodeTypeColorDark(node.data.nodeType)
      : getNodeTypeColor(node.data.nodeType);
  };

  // 노드 클릭 핸들러
  const handleClick = (node: { data: NivoTreemapNode }) => {
    setSelectedPath(node.data.path);
  };

  if (parseError) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-sm">YAML 파싱 에러</p>
        <p className="text-xs mt-1 text-red-400">{parseError.message}</p>
      </div>
    );
  }

  if (!treemapData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
        <LayoutGrid className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">YAML을 입력하면 트리맵이 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <ResponsiveTreeMap
        data={treemapData}
        identity="id"
        value="value"
        valueFormat=" >-.0f"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        labelSkipSize={24}
        label={(node) => node.data.name}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', theme === 'dark' ? 3 : 2]],
        }}
        parentLabelPosition="left"
        parentLabelTextColor={{
          from: 'color',
          modifiers: [['darker', theme === 'dark' ? 3 : 2]],
        }}
        colors={getColor}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
        }}
        borderWidth={1}
        nodeOpacity={0.9}
        onClick={handleClick}
        animate={true}
        motionConfig="gentle"
        theme={{
          labels: {
            text: {
              fontSize: 11,
              fontFamily: 'inherit',
            },
          },
          tooltip: {
            container: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
              fontSize: 12,
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
          },
        }}
        tooltip={({ node }) => (
          <div className="px-3 py-2">
            <div className="font-medium">{node.data.name}</div>
            <div className="text-xs opacity-70 mt-1">
              경로: {node.data.path}
            </div>
            <div className="text-xs opacity-70">
              타입: {node.data.nodeType}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default TreemapViewer;
