import { Sun, Moon, Upload, Download, FileJson, Wand2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { openFileDialog, downloadYaml, downloadJson } from '../../utils/fileUtils';
import { yamlToJson } from '../../utils/jsonUtils';
import { formatYaml } from '../../utils/yamlUtils';
import { IconButton, Divider } from '../common';

export const Header = () => {
  const { theme, toggleTheme, yamlContent, setYamlContent } = useStore();

  const handleUpload = () => {
    openFileDialog('.yaml,.yml,.json', (content) => {
      setYamlContent(content);
    });
  };

  const handleDownloadYaml = () => {
    downloadYaml(yamlContent, 'document.yaml');
  };

  const handleDownloadJson = () => {
    const { json } = yamlToJson(yamlContent);
    if (json) {
      downloadJson(json, 'document.json');
    }
  };

  const handleFormat = () => {
    const formatted = formatYaml(yamlContent);
    if (formatted) {
      setYamlContent(formatted);
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <FileJson className="w-6 h-6 text-blue-500" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          YAML Visualizer
        </h1>
      </div>

      {/* 버튼들 */}
      <div className="flex items-center gap-2">
        <IconButton icon={Upload} onClick={handleUpload} title="파일 열기" />
        <IconButton icon={Download} onClick={handleDownloadYaml} title="YAML 다운로드" />
        <IconButton icon={FileJson} onClick={handleDownloadJson} title="JSON으로 다운로드" />
        <IconButton icon={Wand2} onClick={handleFormat} title="YAML 포맷팅" />

        <Divider />

        {/* 테마 토글 - 아이콘이 조건부라 별도 처리 */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title={theme === 'light' ? '다크 모드' : '라이트 모드'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};
