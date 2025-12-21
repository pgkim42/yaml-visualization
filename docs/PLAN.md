# YAML Visualizer - 구현 계획서

## 개요
YAML 파일을 구문 강조와 함께 시각화하고 편집할 수 있는 웹 애플리케이션

---

## Phase 1: 프로젝트 초기 설정

### 1.1 프로젝트 생성
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### 1.2 라이브러리 설치
```bash
# 에디터
npm install @monaco-editor/react

# YAML 파싱
npm install yaml

# 상태 관리
npm install zustand

# 스타일링
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 아이콘
npm install lucide-react

# 대용량 트리 가상화
npm install react-window
```

### 1.3 폴더 구조 생성
```
src/
├── components/
│   ├── Editor/
│   ├── Viewer/
│   ├── Layout/
│   └── common/
├── hooks/
├── store/
├── utils/
└── types/
```

---

## Phase 2: 핵심 로직 구현

### 2.1 타입 정의 (`src/types/index.ts`)
- TreeNodeData 인터페이스
- YamlError 인터페이스
- 상태 관련 타입

### 2.2 Zustand 스토어 (`src/store/useStore.ts`)
- yamlContent: YAML 원본 텍스트
- parsedData: 파싱된 객체
- parseError: 에러 정보
- theme: 테마 상태
- expandedNodes: 펼쳐진 노드 관리

### 2.3 유틸리티 함수 (`src/utils/`)
- yamlUtils.ts: 파싱, 직렬화, 트리 변환
- fileUtils.ts: 파일 업로드/다운로드

---

## Phase 3: 레이아웃 컴포넌트

### 3.1 Header (`src/components/Layout/Header.tsx`)
- 로고
- 테마 토글 버튼
- 파일 업로드/다운로드 버튼
- 포맷 버튼

### 3.2 SplitPane (`src/components/Layout/SplitPane.tsx`)
- 좌우 분할 레이아웃
- 드래그로 크기 조절 (선택적)

### 3.3 StatusBar (`src/components/Layout/StatusBar.tsx`)
- 파싱 에러 표시
- 라인/컬럼 위치 표시

---

## Phase 4: 에디터 컴포넌트

### 4.1 YamlEditor (`src/components/Editor/YamlEditor.tsx`)
- Monaco Editor 래핑
- YAML 구문 강조
- 실시간 파싱 (debounce 300ms)
- 에러 마커 표시

### 4.2 EditorToolbar (`src/components/Editor/EditorToolbar.tsx`)
- 복사 버튼
- 클리어 버튼
- 샘플 불러오기

---

## Phase 5: 뷰어 컴포넌트

### 5.1 TreeViewer (`src/components/Viewer/TreeViewer.tsx`)
- 트리 컨테이너
- 전체 펼치기/접기 버튼
- 대용량 트리 가상화 (react-window 적용)

### 5.2 SearchBar (`src/components/Viewer/SearchBar.tsx`)
- 키/값 검색 입력
- 검색 결과 하이라이팅
- 이전/다음 검색 결과 이동

### 5.3 TreeNode (`src/components/Viewer/TreeNode.tsx`)
- 재귀적 렌더링
- 접기/펼치기 토글
- 클릭 시 에디터 해당 라인으로 이동 (양방향 동기화)

### 5.4 TypeBadge (`src/components/Viewer/TypeBadge.tsx`)
- 데이터 타입별 색상 배지
- string, number, boolean, null, array, object

---

## Phase 6: 통합 및 마무리

### 6.1 App.tsx 통합
- 모든 컴포넌트 조립
- 레이아웃 완성

### 6.2 스타일링
- Tailwind 다크/라이트 테마
- 반응형 디자인

### 6.3 JSON 변환 기능 (`src/utils/jsonUtils.ts`)
- YAML → JSON 변환
- JSON → YAML 변환
- 복사/다운로드 옵션

### 6.4 추가 기능
- localStorage 저장
- 키보드 단축키 (Ctrl+S 저장 등)

---

## 샘플 YAML (테스트용)

```yaml
server:
  host: localhost
  port: 8080
  ssl:
    enabled: true
    certificate: /path/to/cert.pem

database:
  type: postgresql
  connection:
    host: db.example.com
    port: 5432
    name: myapp
  pool:
    min: 5
    max: 20

features:
  - authentication
  - logging
  - monitoring

users:
  - name: admin
    role: administrator
    active: true
  - name: guest
    role: viewer
    active: false
```

---

## 완료 체크리스트

- [ ] 프로젝트 초기 설정
- [ ] 타입 및 스토어 구현
- [ ] 유틸리티 함수 구현
- [ ] Header 컴포넌트
- [ ] SplitPane 컴포넌트
- [ ] StatusBar 컴포넌트
- [ ] YamlEditor 컴포넌트
- [ ] TreeViewer 컴포넌트 (가상화 포함)
- [ ] SearchBar 컴포넌트
- [ ] TreeNode 컴포넌트
- [ ] TypeBadge 컴포넌트
- [ ] 양방향 동기화 (뷰어 → 에디터)
- [ ] JSON 변환 기능
- [ ] 테마 전환 기능
- [ ] 파일 업로드/다운로드
- [ ] 반응형 디자인
- [ ] 테스트 및 버그 수정
