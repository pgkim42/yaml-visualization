// 노드 타입
export type NodeType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

// 트리 노드 데이터 타입
export interface TreeNodeData {
  key: string;
  value: unknown;
  type: NodeType;
  path: string;
  depth: number;
  children: TreeNodeData[]; // 항상 배열 (빈 배열 가능)
  // 양방향 동기화를 위한 소스 위치 정보
  line?: number;
  column?: number;
}

// 타입 가드
export const isArrayValue = (value: unknown): value is unknown[] => Array.isArray(value);
export const isObjectValue = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// YAML 파싱 에러 타입
export interface YamlError {
  message: string;
  line?: number;
  column?: number;
}

// 파싱 결과 타입 (원자적 상태 업데이트용)
export interface ParseResult {
  data: unknown | null;
  error: YamlError | null;
  treeData: TreeNodeData | null;
}

// 테마 타입
export type Theme = "light" | "dark";

// 뷰어 타입
export type ViewerType = 'tree' | 'treemap' | 'sunburst' | 'mindmap';

// Nivo Treemap 데이터 타입
export interface NivoTreemapNode {
  id: string;
  name: string;
  path: string;
  value?: number;
  children?: NivoTreemapNode[];
  nodeType: NodeType;
}

// Nivo Sunburst 데이터 타입
export interface NivoSunburstNode {
  id: string;
  name: string;
  path: string;
  value?: number;
  children?: NivoSunburstNode[];
  nodeType: NodeType;
}

// React Flow 마인드맵 노드 데이터 타입
export interface MindmapNodeData extends Record<string, unknown> {
  label: string;
  path: string;
  nodeType: NodeType;
  depth: number;
  isSearchMatch?: boolean;
  isSelected?: boolean;
}

// 앱 상태 타입
export interface AppState {
  // YAML 콘텐츠
  yamlContent: string;
  setYamlContent: (content: string) => void;

  // 파싱된 데이터
  parsedData: unknown;
  setParsedData: (data: unknown) => void;

  // 파싱 에러
  parseError: YamlError | null;
  setParseError: (error: YamlError | null) => void;

  // 트리 데이터
  treeData: TreeNodeData | null;
  setTreeData: (data: TreeNodeData | null) => void;

  // 원자적 파싱 결과 업데이트
  setParseResult: (result: ParseResult) => void;

  // 뷰어 상태 - 펼쳐진 노드들
  expandedNodes: Set<string>;
  toggleNode: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // UI 상태 - 테마
  theme: Theme;
  toggleTheme: () => void;

  // 뷰어 타입
  currentViewer: ViewerType;
  setCurrentViewer: (viewer: ViewerType) => void;

  // 선택 상태
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;

  // 검색 상태
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: string[];
  setSearchResults: (results: string[]) => void;
}
