import { useMemo } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { convertToSunburstData, getNodeTypeColor, getNodeTypeColorDark } from '../../utils/visualizationUtils';
import type { NivoSunburstNode } from '../../types';

const SunburstViewer = () => {
  const { treeData, parseError, theme, selectedPath, setSelectedPath, searchResults } = useStore();

  // 선버스트 데이터 변환 (메모이제이션)
  const sunburstData = useMemo(() => {
    if (!treeData) return null;
    return convertToSunburstData(treeData);
  }, [treeData]);

  // 노드 색상 결정
  const getColor = (node: { data: NivoSunburstNode }) => {
    const isSearchMatch = searchResults.includes(node.data.path);
    const isSelected = selectedPath === node.data.path;

    if (isSearchMatch) return '#fbbf24'; // yellow-400
    if (isSelected) return '#3b82f6'; // blue-500

    return theme === 'dark'
      ? getNodeTypeColorDark(node.data.nodeType)
      : getNodeTypeColor(node.data.nodeType);
  };

  // 노드 클릭 핸들러
  const handleClick = (node: { data: NivoSunburstNode }) => {
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

  if (!sunburstData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
        <Sun className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">YAML을 입력하면 선버스트가 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <ResponsiveSunburst
        data={sunburstData}
        id="id"
        value="value"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        cornerRadius={2}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
        }}
        colors={getColor}
        childColor={{
          from: 'color',
          modifiers: [['brighter', 0.2]],
        }}
        enableArcLabels={true}
        arcLabel={(node) => node.data.name}
        arcLabelsSkipAngle={12}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', theme === 'dark' ? 3 : 2]],
        }}
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
        tooltip={({ color, data }) => (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="text-xs opacity-70 mt-1">
              경로: {data.path}
            </div>
            <div className="text-xs opacity-70">
              타입: {data.nodeType}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default SunburstViewer;
