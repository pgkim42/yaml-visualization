# YAML Visualizer v2 - 아키텍처 변경사항

## 1. 개요

v1 기반에서 다중 시각화 기능을 추가하기 위한 아키텍처 변경 사항을 정리합니다.

---

## 2. 신규 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| @nivo/treemap | ^0.87.0 | 트리맵 시각화 |
| @nivo/sunburst | ^0.87.0 | 선버스트 시각화 |
| @xyflow/react | ^12.0.0 | 마인드맵 (노드 다이어그램) |

---

## 3. 컴포넌트 구조 변경

### 3.1 기존 구조
```
App
├── Header
├── SplitPane
│   ├── LeftPanel (Editor)
│   └── RightPanel
│       └── TreeViewer    <-- 단일 뷰어
└── StatusBar
```

### 3.2 변경 구조
```
App
├── Header
├── SplitPane
│   ├── LeftPanel (Editor)
│   └── RightPanel
│       └── ViewerContainer    <-- 뷰어 컨테이너
│           ├── ViewerTabs     <-- 탭 UI
│           └── (Dynamic)
│               ├── TreeViewer
│               ├── TreemapViewer
│               ├── SunburstViewer
│               └── MindmapViewer
└── StatusBar
```

---

## 4. 상태 관리 확장

### 4.1 신규 상태
```typescript
interface AppState {
  // ... 기존 상태 ...

  // v2 추가
  currentViewer: ViewerType;
  setCurrentViewer: (viewer: ViewerType) => void;
}

type ViewerType = 'tree' | 'treemap' | 'sunburst' | 'mindmap';
```

### 4.2 상태 흐름
```
User Tab Click
    │
    ▼
setCurrentViewer()
    │
    ▼
ViewerContainer re-render
    │
    ▼
해당 Viewer 컴포넌트 렌더링
```

---

## 5. 데이터 변환 계층

### 5.1 데이터 흐름
```
YAML String
    │
    ▼ (yamlUtils.ts)
TreeNodeData
    │
    ├──────────────────┬───────────────────┬──────────────────┐
    ▼                  ▼                   ▼                  ▼
TreeViewer      NivoTreemapNode     NivoSunburstNode    FlowNode/Edge
(직접 사용)     (convertToTreemap)  (convertToSunburst) (convertToMindmap)
```

### 5.2 변환 함수 (visualizationUtils.ts)
```typescript
// TreeNodeData → Nivo Treemap
convertToTreemapData(node: TreeNodeData): NivoTreemapNode

// TreeNodeData → Nivo Sunburst
convertToSunburstData(node: TreeNodeData): NivoSunburstNode

// TreeNodeData → React Flow
convertToMindmapData(node: TreeNodeData): { nodes: Node[], edges: Edge[] }
```

---

## 6. 번들 최적화

### 6.1 동적 Import
```typescript
// ViewerContainer.tsx
const TreemapViewer = lazy(() => import('./TreemapViewer'));
const SunburstViewer = lazy(() => import('./SunburstViewer'));
const MindmapViewer = lazy(() => import('./MindmapViewer'));
```

### 6.2 예상 번들 분리
```
main.js          - React, Zustand, 공통 컴포넌트
monaco-editor.js - Monaco Editor (기존)
nivo.js          - @nivo/treemap, @nivo/sunburst
react-flow.js    - @xyflow/react
```

---

## 7. 타입 정의 추가

### 7.1 뷰어 타입
```typescript
export type ViewerType = 'tree' | 'treemap' | 'sunburst' | 'mindmap';
```

### 7.2 Nivo 데이터 타입
```typescript
export interface NivoTreemapNode {
  id: string;
  name: string;
  path: string;
  value?: number;
  children?: NivoTreemapNode[];
  nodeType: NodeType;
}

export interface NivoSunburstNode {
  id: string;
  name: string;
  path: string;
  value?: number;
  children?: NivoSunburstNode[];
  nodeType: NodeType;
}
```

### 7.3 React Flow 데이터 타입
```typescript
export interface MindmapNodeData {
  label: string;
  path: string;
  nodeType: NodeType;
  depth: number;
  isSearchMatch?: boolean;
  isSelected?: boolean;
}
```

---

## 8. 스타일 추가

### 8.1 React Flow 스타일 (index.css)
```css
/* React Flow 기본 스타일 */
@import '@xyflow/react/dist/style.css';

/* 다크모드 컨트롤 */
.dark .react-flow__controls { ... }

/* 다크모드 미니맵 */
.dark .react-flow__minimap { ... }
```

---

## 9. 파일 구조 변경

### 9.1 신규 파일
```
src/
├── components/Viewer/
│   ├── ViewerContainer.tsx   # 뷰어 컨테이너
│   ├── ViewerTabs.tsx        # 탭 UI
│   ├── TreemapViewer.tsx     # Nivo 트리맵
│   ├── SunburstViewer.tsx    # Nivo 선버스트
│   ├── MindmapNode.tsx       # 커스텀 노드
│   └── MindmapViewer.tsx     # React Flow 마인드맵
├── utils/
│   └── visualizationUtils.ts # 데이터 변환
└── types/
    └── index.ts              # 타입 추가
```

### 9.2 수정 파일
```
src/
├── store/useStore.ts         # currentViewer 추가
├── components/Viewer/
│   ├── TreeViewer.tsx        # 헤더 간소화
│   └── index.ts              # export 업데이트
├── App.tsx                   # ViewerContainer 사용
└── index.css                 # React Flow 스타일
```
