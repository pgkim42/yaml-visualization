import { useEffect, useState, useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Header, SplitPane, StatusBar } from './components/Layout';
import { YamlEditor, EditorToolbar } from './components/Editor';
import { ViewerContainer } from './components/Viewer';
import { ToastContainer } from './components/common';
import { useStore } from './store/useStore';
import { useYamlParser, useLocalStorage, useKeyboardShortcuts } from './hooks';
import { readFile } from './utils/fileUtils';

// 허용되는 파일 확장자
const ALLOWED_EXTENSIONS = ['yaml', 'yml', 'json'];

function App() {
  const { theme, setYamlContent, addToast } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragCountRef = useRef(0);

  // 훅 활성화
  useYamlParser();        // YAML 실시간 파싱
  useLocalStorage();       // 로컬 스토리지 저장/복원
  useKeyboardShortcuts();  // 키보드 단축키

  // 테마 변경 시 html에 dark 클래스 적용
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current++;
    if (dragCountRef.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current--;
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer?.files[0];
    if (!file) return;

    // 확장자 검증
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      addToast(`지원하지 않는 파일 형식입니다. (.yaml, .yml, .json만 가능)`, 'error');
      return;
    }

    try {
      const content = await readFile(file);
      setYamlContent(content);
      addToast(`파일 로드됨: ${file.name}`, 'success');
    } catch {
      addToast('파일을 읽는 중 오류가 발생했습니다.', 'error');
    }
  }, [addToast, setYamlContent]);

  return (
    <div 
      className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Header />

      <SplitPane
        left={
          <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            <EditorToolbar />
            <div className="flex-1">
              <YamlEditor />
            </div>
          </div>
        }
        right={<ViewerContainer />}
      />

      <StatusBar />

      {/* 드래그 앤 드롭 오버레이 */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl border-2 border-dashed border-blue-500">
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">파일을 여기에 놓으세요</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">.yaml, .yml, .json</p>
          </div>
        </div>
      )}

      {/* 토스트 컨테이너 */}
      <ToastContainer />
    </div>
  );
}

export default App;
