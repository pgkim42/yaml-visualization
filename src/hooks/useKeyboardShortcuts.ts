import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { downloadYaml, copyToClipboard } from '../utils/fileUtils';
import { formatYaml } from '../utils/yamlUtils';

export const useKeyboardShortcuts = () => {
  const { yamlContent, setYamlContent, toggleTheme, expandAll, collapseAll } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd 키 조합
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (!isCtrlOrCmd) return;

      switch (e.key.toLowerCase()) {
        // Ctrl+S: YAML 다운로드
        case 's':
          e.preventDefault();
          downloadYaml(yamlContent, 'document.yaml');
          break;

        // Ctrl+Shift+C: 클립보드에 복사
        case 'c':
          if (e.shiftKey) {
            e.preventDefault();
            copyToClipboard(yamlContent);
          }
          break;

        // Ctrl+Shift+F: 포맷팅
        case 'f':
          if (e.shiftKey) {
            e.preventDefault();
            const formatted = formatYaml(yamlContent);
            if (formatted) {
              setYamlContent(formatted);
            }
          }
          break;

        // Ctrl+D: 다크모드 토글
        case 'd':
          e.preventDefault();
          toggleTheme();
          break;

        // Ctrl+E: 전체 펼치기
        case 'e':
          e.preventDefault();
          expandAll();
          break;

        // Ctrl+W: 전체 접기
        case 'w':
          e.preventDefault();
          collapseAll();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [yamlContent, setYamlContent, toggleTheme, expandAll, collapseAll]);
};
