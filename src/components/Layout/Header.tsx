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
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between">
      {/* 로고 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
          <FileJson className="w-4 h-4 text-white dark:text-gray-900" />
        </div>
        <h1 className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-tight">
          YAML Visualizer
        </h1>
      </div>

      {/* 버튼들 */}
      <div className="flex items-center gap-1">
        <IconButton icon={Upload} onClick={handleUpload} title="파일 열기" />
        <IconButton icon={Download} onClick={handleDownloadYaml} title="YAML 다운로드" />
        <IconButton icon={FileJson} onClick={handleDownloadJson} title="JSON으로 다운로드" />
        <IconButton icon={Wand2} onClick={handleFormat} title="YAML 포맷팅" />

        <Divider />

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title={theme === 'light' ? '다크 모드' : '라이트 모드'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
