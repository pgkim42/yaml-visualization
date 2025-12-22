# YAML Visualization 다중 시각화 기능 구현 계획

## 개요
- **목표**: Nivo + React Flow를 사용한 다중 시각화 뷰 추가
- **라이브러리**: `@nivo/treemap`, `@nivo/sunburst`, `@xyflow/react`
- **뷰 종류**: 트리(기존), 트리맵, 선버스트, 마인드맵

---

## Phase 1: 기반 작업

### 1.1 패키지 설치
```bash
npm install @nivo/treemap @nivo/sunburst @xyflow/react
```

### 1.2 타입 정의 추가
**파일**: `src/types/index.ts`

```typescript
// 뷰어 타입
export type ViewerType = 'tree' | 'treemap' | 'sunburst' | 'mindmap';

// Nivo 데이터 타입
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

// React Flow 노드 데이터
export interface MindmapNodeData {
  label: string;
  path: string;
  nodeType: NodeType;
  depth: number;
  isSearchMatch?: boolean;
  isSelected?: boolean;
}
```

### 1.3 상태 관리 확장
**파일**: `src/store/useStore.ts`

```typescript
// AppState에 추가
currentViewer: ViewerType;
setCurrentViewer: (viewer: ViewerType) => void;
```

### 1.4 데이터 변환 유틸리티
**새 파일**: `src/utils/visualizationUtils.ts`

- `convertToTreemapData()` - TreeNodeData → Nivo Treemap 형식
- `convertToSunburstData()` - TreeNodeData → Nivo Sunburst 형식
- `convertToMindmapData()` - TreeNodeData → React Flow 노드/엣지
- `getNodeTypeColor()` - 노드 타입별 색상 반환

---

## Phase 2: 뷰어 탭 UI

### 2.1 ViewerTabs 컴포넌트
**새 파일**: `src/components/Viewer/ViewerTabs.tsx`

- 4개 탭: 트리, 트리맵, 선버스트, 마인드맵
- lucide-react 아이콘 사용
- 다크모드 지원

### 2.2 ViewerContainer 컴포넌트
**새 파일**: `src/components/Viewer/ViewerContainer.tsx`

- 탭 전환 로직
- React.lazy로 동적 import (번들 최적화)
- Suspense fallback

### 2.3 App.tsx 수정
**파일**: `src/App.tsx`

```typescript
// 변경: TreeViewer → ViewerContainer
<SplitPane right={<ViewerContainer />} />
```

### 2.4 TreeViewer 간소화
**파일**: `src/components/Viewer/TreeViewer.tsx`

- 헤더에서 뷰어 라벨 제거 (탭으로 이동됨)
- 펼치기/접기 버튼만 유지

---

## Phase 3: Nivo 시각화

### 3.1 TreemapViewer
**새 파일**: `src/components/Viewer/TreemapViewer.tsx`

- ResponsiveTreeMap 사용
- 노드 클릭 시 selectedPath 업데이트
- 검색 결과 노드 하이라이트 (노란색)
- 선택된 노드 하이라이트 (파란색)
- 다크모드 테마

### 3.2 SunburstViewer
**새 파일**: `src/components/Viewer/SunburstViewer.tsx`

- ResponsiveSunburst 사용
- 동심원 형태 계층 시각화
- 노드 클릭/하이라이트 동일 패턴

---

## Phase 4: React Flow 마인드맵

### 4.1 MindmapNode 커스텀 노드
**새 파일**: `src/components/Viewer/MindmapNode.tsx`

- 타입별 배경색
- 선택/검색 하이라이트 (ring 스타일)
- Handle 컴포넌트로 연결점

### 4.2 MindmapViewer
**새 파일**: `src/components/Viewer/MindmapViewer.tsx`

- ReactFlow 컴포넌트
- 수평 레이아웃 (왼쪽→오른쪽)
- Background, Controls, MiniMap
- 노드 드래그/줌/팬 지원

### 4.3 CSS 추가
**파일**: `src/index.css`

- React Flow 다크모드 컨트롤 스타일
- 미니맵 다크모드 스타일

---

## 파일 구조

```
src/
├── components/Viewer/
│   ├── index.ts              # export 업데이트
│   ├── ViewerContainer.tsx   # 새 파일
│   ├── ViewerTabs.tsx        # 새 파일
│   ├── TreeViewer.tsx        # 수정
│   ├── TreemapViewer.tsx     # 새 파일
│   ├── SunburstViewer.tsx    # 새 파일
│   ├── MindmapViewer.tsx     # 새 파일
│   ├── MindmapNode.tsx       # 새 파일
│   └── ... (기존 파일)
├── utils/
│   └── visualizationUtils.ts # 새 파일
├── types/
│   └── index.ts              # 수정
├── store/
│   └── useStore.ts           # 수정
└── App.tsx                   # 수정
```

---

## 수정 파일 체크리스트

| 파일 | 작업 | 설명 |
|------|------|------|
| `package.json` | 수정 | 패키지 추가 |
| `src/types/index.ts` | 수정 | 타입 추가 |
| `src/store/useStore.ts` | 수정 | currentViewer 상태 추가 |
| `src/utils/visualizationUtils.ts` | 새 파일 | 데이터 변환 유틸 |
| `src/components/Viewer/ViewerTabs.tsx` | 새 파일 | 탭 UI |
| `src/components/Viewer/ViewerContainer.tsx` | 새 파일 | 뷰 전환 컨테이너 |
| `src/components/Viewer/TreemapViewer.tsx` | 새 파일 | Nivo 트리맵 |
| `src/components/Viewer/SunburstViewer.tsx` | 새 파일 | Nivo 선버스트 |
| `src/components/Viewer/MindmapNode.tsx` | 새 파일 | 커스텀 노드 |
| `src/components/Viewer/MindmapViewer.tsx` | 새 파일 | React Flow 마인드맵 |
| `src/components/Viewer/TreeViewer.tsx` | 수정 | 헤더 간소화 |
| `src/components/Viewer/index.ts` | 수정 | export 업데이트 |
| `src/App.tsx` | 수정 | ViewerContainer 사용 |
| `src/index.css` | 수정 | React Flow 스타일 |

---

## 구현 순서

1. **패키지 설치**
2. **타입 & 상태 확장** (types, store)
3. **데이터 변환 유틸** (visualizationUtils)
4. **탭 UI** (ViewerTabs, ViewerContainer)
5. **App.tsx 수정**
6. **TreeViewer 간소화**
7. **TreemapViewer 구현**
8. **SunburstViewer 구현**
9. **MindmapNode & MindmapViewer 구현**
10. **CSS 스타일 추가**
11. **빌드 테스트**

---

## 주요 기능

- **뷰 전환**: 탭 클릭으로 4가지 시각화 전환
- **노드 선택**: 모든 뷰에서 클릭 시 selectedPath 동기화
- **검색 하이라이트**: 검색 결과 노드 강조 표시
- **다크모드**: 전체 테마 일관성 유지
- **반응형**: 컨테이너 크기에 맞게 자동 조절
- **성능 최적화**: 동적 import, useMemo 활용
