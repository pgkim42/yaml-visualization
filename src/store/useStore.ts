import { create } from 'zustand';
import type { AppState, TreeNodeData, YamlError, Theme, ParseResult } from '../types';
import { SAMPLE_YAML } from '../constants';

// 모든 노드의 경로를 수집하는 헬퍼 함수
const collectAllPaths = (node: TreeNodeData | null): string[] => {
  if (!node) return [];
  const paths: string[] = [node.path];
  node.children.forEach((child) => {
    paths.push(...collectAllPaths(child));
  });
  return paths;
};

export const useStore = create<AppState>((set) => ({
  // YAML 콘텐츠
  yamlContent: SAMPLE_YAML,
  setYamlContent: (content: string) => set({ yamlContent: content }),

  // 파싱된 데이터
  parsedData: null,
  setParsedData: (data: unknown) => set({ parsedData: data }),

  // 파싱 에러
  parseError: null,
  setParseError: (error: YamlError | null) => set({ parseError: error }),

  // 트리 데이터
  treeData: null,
  setTreeData: (data: TreeNodeData | null) => set({ treeData: data }),

  // 원자적 파싱 결과 업데이트
  setParseResult: (result: ParseResult) => set({
    parsedData: result.data,
    parseError: result.error,
    treeData: result.treeData,
  }),

  // 뷰어 상태 - 펼쳐진 노드들
  expandedNodes: new Set<string>(),
  toggleNode: (path: string) =>
    set((state) => {
      const newExpanded = new Set(state.expandedNodes);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return { expandedNodes: newExpanded };
    }),
  expandAll: () =>
    set((state) => {
      const allPaths = collectAllPaths(state.treeData);
      return { expandedNodes: new Set(allPaths) };
    }),
  collapseAll: () => set({ expandedNodes: new Set() }),

  // UI 상태 - 테마
  theme: (typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark' : 'light' as Theme,
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  // 선택 상태
  selectedPath: null,
  setSelectedPath: (path: string | null) => set({ selectedPath: path }),

  // 검색 상태
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results: string[]) => set({ searchResults: results }),
}));
