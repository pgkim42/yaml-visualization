import type { Node, Edge } from '@xyflow/react';
import type {
  TreeNodeData,
  NodeType,
  NivoTreemapNode,
  NivoSunburstNode,
  MindmapNodeData,
} from '../types';

// 노드 타입별 색상 반환 (라이트 모드)
export const getNodeTypeColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    string: '#22c55e',   // green-500
    number: '#3b82f6',   // blue-500
    boolean: '#a855f7',  // purple-500
    null: '#6b7280',     // gray-500
    array: '#f97316',    // orange-500
    object: '#06b6d4',   // cyan-500
  };
  return colors[type];
};

// 노드 타입별 색상 반환 (다크 모드)
export const getNodeTypeColorDark = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    string: '#4ade80',   // green-400
    number: '#60a5fa',   // blue-400
    boolean: '#c084fc',  // purple-400
    null: '#9ca3af',     // gray-400
    array: '#fb923c',    // orange-400
    object: '#22d3ee',   // cyan-400
  };
  return colors[type];
};

// 노드 값 계산 (자식 수 또는 1)
const calculateNodeValue = (node: TreeNodeData): number => {
  if (node.children.length === 0) {
    return 1;
  }
  return node.children.reduce((sum, child) => sum + calculateNodeValue(child), 0);
};

// TreeNodeData → Nivo Treemap 형식 변환
export const convertToTreemapData = (node: TreeNodeData): NivoTreemapNode => {
  const children = node.children.map(convertToTreemapData);

  return {
    id: node.path,
    name: node.key,
    path: node.path,
    nodeType: node.type,
    value: children.length === 0 ? 1 : undefined,
    children: children.length > 0 ? children : undefined,
  };
};

// TreeNodeData → Nivo Sunburst 형식 변환
export const convertToSunburstData = (node: TreeNodeData): NivoSunburstNode => {
  const children = node.children.map(convertToSunburstData);

  return {
    id: node.path,
    name: node.key,
    path: node.path,
    nodeType: node.type,
    value: children.length === 0 ? 1 : undefined,
    children: children.length > 0 ? children : undefined,
  };
};

// 마인드맵 레이아웃 상수
const MINDMAP_LAYOUT = {
  HORIZONTAL_SPACING: 200,
  VERTICAL_SPACING: 60,
  NODE_WIDTH: 150,
  NODE_HEIGHT: 40,
};

// TreeNodeData → React Flow 노드/엣지 변환
export const convertToMindmapData = (
  rootNode: TreeNodeData,
  searchResults: string[] = [],
  selectedPath: string | null = null
): { nodes: Node<MindmapNodeData>[]; edges: Edge[] } => {
  const nodes: Node<MindmapNodeData>[] = [];
  const edges: Edge[] = [];

  // 각 깊이별 노드 수를 추적하여 y 위치 계산
  const depthCounts: Map<number, number> = new Map();
  const depthOffsets: Map<number, number> = new Map();

  // 먼저 각 깊이별 노드 수 계산
  const countNodesAtDepth = (node: TreeNodeData) => {
    const count = depthCounts.get(node.depth) || 0;
    depthCounts.set(node.depth, count + 1);
    node.children.forEach(countNodesAtDepth);
  };
  countNodesAtDepth(rootNode);

  // 재귀적으로 노드와 엣지 생성
  const processNode = (node: TreeNodeData, parentId: string | null = null) => {
    const currentOffset = depthOffsets.get(node.depth) || 0;
    const totalAtDepth = depthCounts.get(node.depth) || 1;

    // y 위치 계산 (중앙 정렬)
    const yPosition = (currentOffset - (totalAtDepth - 1) / 2) * MINDMAP_LAYOUT.VERTICAL_SPACING;

    depthOffsets.set(node.depth, currentOffset + 1);

    // 노드 생성
    const flowNode: Node<MindmapNodeData> = {
      id: node.path,
      type: 'mindmapNode',
      position: {
        x: node.depth * MINDMAP_LAYOUT.HORIZONTAL_SPACING,
        y: yPosition,
      },
      data: {
        label: node.key,
        path: node.path,
        nodeType: node.type,
        depth: node.depth,
        isSearchMatch: searchResults.includes(node.path),
        isSelected: selectedPath === node.path,
      },
    };
    nodes.push(flowNode);

    // 부모가 있으면 엣지 생성
    if (parentId) {
      edges.push({
        id: `${parentId}-${node.path}`,
        source: parentId,
        target: node.path,
        type: 'smoothstep',
        animated: false,
      });
    }

    // 자식 노드 처리
    node.children.forEach((child) => processNode(child, node.path));
  };

  processNode(rootNode);

  return { nodes, edges };
};

// 검색 결과 하이라이트 판단
export const isSearchMatch = (path: string, searchResults: string[]): boolean => {
  return searchResults.includes(path);
};

// 선택 상태 판단
export const isSelected = (path: string, selectedPath: string | null): boolean => {
  return path === selectedPath;
};
