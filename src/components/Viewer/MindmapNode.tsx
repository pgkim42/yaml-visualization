import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { MindmapNodeData } from '../../types';
import { getNodeTypeColor, getNodeTypeColorDark } from '../../utils/visualizationUtils';
import { useStore } from '../../store/useStore';

const MindmapNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as MindmapNodeData;
  const { theme } = useStore();

  const bgColor = theme === 'dark'
    ? getNodeTypeColorDark(nodeData.nodeType)
    : getNodeTypeColor(nodeData.nodeType);

  // 하이라이트 스타일
  const ringStyle = nodeData.isSearchMatch
    ? 'ring-2 ring-yellow-400 ring-offset-2'
    : nodeData.isSelected || selected
    ? 'ring-2 ring-blue-500 ring-offset-2'
    : '';

  const ringOffsetColor = theme === 'dark' ? 'ring-offset-gray-900' : 'ring-offset-gray-50';

  return (
    <>
      {/* 왼쪽 연결점 (루트 노드 제외) */}
      {nodeData.depth > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2 !h-2 !bg-gray-400 !border-0"
        />
      )}

      {/* 노드 본체 */}
      <div
        className={`
          px-3 py-1.5 rounded-lg shadow-md cursor-pointer
          transition-all duration-200
          ${ringStyle} ${ringOffsetColor}
        `}
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-sm font-medium text-white drop-shadow-sm">
          {nodeData.label}
        </span>
      </div>

      {/* 오른쪽 연결점 */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-gray-400 !border-0"
      />
    </>
  );
});

MindmapNode.displayName = 'MindmapNode';

export default MindmapNode;
