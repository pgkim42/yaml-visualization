# YAML Visualizer - 기술 아키텍처

## 1. 기술 스택

### 1.1 Core
| 카테고리 | 기술 | 선택 이유 |
|---------|------|----------|
| 프레임워크 | React 19 | 컴포넌트 기반, 풍부한 생태계 |
| 언어 | TypeScript | 타입 안정성, 개발 생산성 |
| 빌드 도구 | Vite | 빠른 HMR, 간단한 설정 |
| 패키지 매니저 | npm | 표준 도구, 안정성 |

### 1.2 주요 라이브러리
| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| @monaco-editor/react | ^4.6.0 | 코드 에디터 (VSCode 기반) |
| yaml | ^2.3.0 | YAML 파싱/직렬화 |
| zustand | ^4.4.0 | 상태 관리 |
| tailwindcss | ^3.4.0 | 스타일링 |
| lucide-react | ^0.300.0 | 아이콘 |

---

## 2. 프로젝트 구조

```
yaml-visualization/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── YamlEditor.tsx       # Monaco 에디터 래퍼
│   │   │   └── EditorToolbar.tsx    # 에디터 상단 툴바
│   │   ├── Viewer/
│   │   │   ├── TreeViewer.tsx       # 트리 구조 뷰어
│   │   │   ├── TreeNode.tsx         # 개별 트리 노드
│   │   │   ├── TypeBadge.tsx        # 타입 표시 배지
│   │   │   └── SearchBar.tsx        # 트리 검색 입력
│   │   ├── Layout/
│   │   │   ├── Header.tsx           # 상단 헤더
│   │   │   ├── SplitPane.tsx        # 좌우 분할 패널
│   │   │   └── StatusBar.tsx        # 하단 상태바
│   │   └── common/
│   │       ├── Button.tsx
│   │       └── Tooltip.tsx
│   ├── hooks/
│   │   ├── useYamlParser.ts         # YAML 파싱 훅
│   │   ├── useLocalStorage.ts       # 로컬 스토리지 훅
│   │   └── useTheme.ts              # 테마 관리 훅
│   ├── store/
│   │   └── useStore.ts              # Zustand 스토어
│   ├── utils/
│   │   ├── yamlUtils.ts             # YAML 유틸리티 함수
│   │   ├── jsonUtils.ts             # JSON 변환 유틸리티
│   │   └── fileUtils.ts             # 파일 처리 유틸리티
│   ├── types/
│   │   └── index.ts                 # TypeScript 타입 정의
│   ├── App.tsx                      # 메인 앱 컴포넌트
│   ├── index.css                    # 전역 스타일
│   └── main.tsx                     # 엔트리 포인트
├── PRD.md
├── ARCHITECTURE.md
├── PLAN.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 3. 컴포넌트 아키텍처

```
App
├── Header
│   ├── Logo
│   ├── ThemeToggle
│   └── MenuButtons (Upload, Download, Format)
├── SplitPane
│   ├── LeftPanel
│   │   ├── EditorToolbar
│   │   └── YamlEditor (Monaco)
│   └── RightPanel
│       └── TreeViewer
│           ├── SearchBar
│           └── TreeNode (recursive)
│               └── TypeBadge
└── StatusBar
    ├── ErrorDisplay
    └── CursorPosition
```

---

## 4. 상태 관리 (Zustand Store)

```typescript
interface AppState {
  // YAML 콘텐츠
  yamlContent: string;
  setYamlContent: (content: string) => void;

  // 파싱된 데이터
  parsedData: unknown;
  parseError: string | null;

  // 뷰어 상태
  expandedNodes: Set<string>;
  toggleNode: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // UI 상태
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // 선택 상태
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;

  // 검색 상태
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: string[];  // 매칭된 노드 경로들
}
```

---

## 5. 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  User Input (Editor)                                        │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Monaco    │────▶│    YAML     │────▶│   Zustand   │   │
│  │   Editor    │     │   Parser    │     │    Store    │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                             │                   │           │
│                             ▼                   │           │
│                      ┌─────────────┐            │           │
│                      │   Parse     │            │           │
│                      │   Error?    │            │           │
│                      └─────────────┘            │           │
│                        │       │                │           │
│                       Yes      No               │           │
│                        │       │                │           │
│                        ▼       ▼                ▼           │
│                  ┌─────────┐ ┌─────────┐  ┌─────────────┐   │
│                  │  Show   │ │ Update  │  │    Tree     │   │
│                  │  Error  │ │  Tree   │  │   Viewer    │   │
│                  └─────────┘ └─────────┘  └─────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. 주요 인터페이스

### 6.1 TreeNode 타입
```typescript
interface TreeNodeData {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';
  path: string;
  depth: number;
  children?: TreeNodeData[];
  // 양방향 동기화를 위한 소스 위치 정보
  line?: number;    // 에디터에서의 시작 라인
  column?: number;  // 에디터에서의 시작 컬럼
}
```

### 6.2 에러 타입
```typescript
interface YamlError {
  message: string;
  line?: number;
  column?: number;
}
```

---

## 7. 성능 최적화 전략

### 7.1 에디터
- 디바운싱: 타이핑 후 300ms 후 파싱 실행
- Monaco 에디터 웹 워커 활용

### 7.2 트리 뷰어
- React.memo로 불필요한 리렌더링 방지
- 가상화(Virtualization): 대용량 트리 처리 시 react-window 활용
- 접힌 노드의 자식은 렌더링 스킵

### 7.3 번들 최적화
- 코드 스플리팅: Monaco 에디터 lazy loading
- Tree shaking 활용

---

## 8. 핵심 유틸리티 기능

| 기능 | 설명 | 구현 위치 |
|------|------|----------|
| JSON 변환 | YAML ↔ JSON 상호 변환 | `utils/jsonUtils.ts` |
| 검색 | 트리 노드 키/값 검색 | `components/Viewer/SearchBar.tsx` |
| 양방향 동기화 | 뷰어 클릭 → 에디터 커서 이동 | `TreeNodeData.line/column` 활용 |

---

## 9. 확장 가능성 (향후)

| 기능 | 설명 | 백엔드 필요 |
|------|------|------------|
| 다중 탭 | 여러 YAML 파일 동시 편집 | ❌ |
| 비교 뷰 | 두 YAML 파일 diff | ❌ |
| URL 공유 | 링크로 YAML 공유 | ✅ Firebase/Supabase |
| 실시간 협업 | 다중 사용자 편집 | ✅ Firebase/Supabase |
