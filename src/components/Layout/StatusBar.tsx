import { AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const StatusBar = () => {
  const { parseError, yamlContent } = useStore();

  // 라인 수 계산
  const lineCount = yamlContent.split('\n').length;

  // 문자 수 계산
  const charCount = yamlContent.length;

  return (
    <footer className="h-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between text-xs">
      {/* 왼쪽: 에러 또는 성공 상태 */}
      <div className="flex items-center gap-2">
        {parseError ? (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-500">
              에러: {parseError.message}
              {parseError.line && ` (줄 ${parseError.line})`}
            </span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400">
              유효한 YAML
            </span>
          </>
        )}
      </div>

      {/* 오른쪽: 문서 정보 */}
      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
        <span>{lineCount} 줄</span>
        <span>{charCount.toLocaleString()} 문자</span>
        <span>YAML</span>
      </div>
    </footer>
  );
};
