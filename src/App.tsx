import { useEffect } from 'react';
import { Header, SplitPane, StatusBar } from './components/Layout';
import { YamlEditor, EditorToolbar } from './components/Editor';
import { ViewerContainer } from './components/Viewer';
import { useStore } from './store/useStore';
import { useYamlParser, useLocalStorage, useKeyboardShortcuts } from './hooks';

function App() {
  const { theme } = useStore();

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

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
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
    </div>
  );
}

export default App;
