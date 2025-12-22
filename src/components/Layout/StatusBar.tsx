import { AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const StatusBar = () => {
  const { parseError, yamlContent } = useStore();

  // 라인 수 계산
  const lineCount = yamlContent.split('\n').length;

  // 문자 수 계산
  const charCount = yamlContent.length;

  return (
    <footer className="h-7 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 flex items-center justify-between text-xs">
      {/* 왼쪽: 에러 또는 성공 상태 */}
      <div className="flex items-center gap-2">
        {parseError ? (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-red-500 font-medium">
              {parseError.message}
              {parseError.line && ` (줄 ${parseError.line})`}
            </span>
          </>
        ) : (
          <>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">
              Valid
            </span>
          </>
        )}
      </div>

      {/* 오른쪽: 문서 정보 */}
      <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
        <span>{lineCount} lines</span>
        <span>{charCount.toLocaleString()} chars</span>
        <span className="font-medium text-gray-500 dark:text-gray-400">YAML</span>
      </div>
    </footer>
  );
};
