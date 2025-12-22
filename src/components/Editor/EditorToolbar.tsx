import { Copy, Trash2, FileText, Check } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { copyToClipboard } from '../../utils/fileUtils';
import { SAMPLE_YAML, TIMING } from '../../constants';
import { ToolbarButton } from '../common';

export const EditorToolbar = () => {
  const { yamlContent, setYamlContent } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(yamlContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK_MS);
    }
  };

  const handleClear = () => {
    setYamlContent('');
  };

  const handleLoadSample = () => {
    setYamlContent(SAMPLE_YAML);
  };

  return (
    <div className="h-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 flex items-center gap-1">
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide">
        EDITOR
      </span>

      <div className="flex-1" />

      <ToolbarButton icon={FileText} onClick={handleLoadSample} title="샘플 불러오기">
        샘플
      </ToolbarButton>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="클립보드에 복사"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500">복사됨</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>복사</span>
          </>
        )}
      </button>

      <ToolbarButton icon={Trash2} onClick={handleClear} title="에디터 비우기">
        지우기
      </ToolbarButton>
    </div>
  );
};
