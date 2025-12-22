import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { convertToMindmapData, getNodeTypeColor, getNodeTypeColorDark } from '../../utils/visualizationUtils';
import MindmapNode from './MindmapNode';
import type { MindmapNodeData } from '../../types';

// 커스텀 노드 타입 등록
const nodeTypes = {
  mindmapNode: MindmapNode,
};

const MindmapViewer = () => {
  const { treeData, parseError, theme, selectedPath, setSelectedPath, searchResults } = useStore();

  // 마인드맵 데이터 변환 (메모이제이션)
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!treeData) return { initialNodes: [], initialEdges: [] };
    const { nodes, edges } = convertToMindmapData(treeData, searchResults, selectedPath);
    return { initialNodes: nodes, initialEdges: edges };
  }, [treeData, searchResults, selectedPath]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 노드가 변경될 때 업데이트
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // 노드 클릭 핸들러
  const handleNodeClick: NodeMouseHandler<Node<MindmapNodeData>> = useCallback(
    (_, node) => {
      setSelectedPath(node.data.path);
    },
    [setSelectedPath]
  );

  // 미니맵 노드 색상
  const getMinimapNodeColor = (node: Node<MindmapNodeData>) => {
    return theme === 'dark'
      ? getNodeTypeColorDark(node.data.nodeType)
      : getNodeTypeColor(node.data.nodeType);
  };

  if (parseError) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-sm">YAML 파싱 에러</p>
        <p className="text-xs mt-1 text-red-400">{parseError.message}</p>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
        <GitBranch className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">YAML을 입력하면 마인드맵이 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        className={theme === 'dark' ? 'dark' : ''}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={theme === 'dark' ? '#374151' : '#e5e7eb'}
          gap={16}
        />
        <Controls
          className={theme === 'dark' ? 'react-flow-controls-dark' : ''}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={getMinimapNodeColor}
          maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
          className={theme === 'dark' ? 'react-flow-minimap-dark' : ''}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

export default MindmapViewer;
