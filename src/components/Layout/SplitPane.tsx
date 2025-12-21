import { useState, useCallback, useRef, useEffect } from 'react';
import { Code, FolderTree } from 'lucide-react';
import { LAYOUT } from '../../constants';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

export const SplitPane = ({
  left,
  right,
  defaultRatio = 0.5,
  minLeftWidth = LAYOUT.MIN_PANE_WIDTH,
  minRightWidth = LAYOUT.MIN_PANE_WIDTH,
}: SplitPaneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'viewer'>('editor');

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < LAYOUT.MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 초기 너비 설정
  useEffect(() => {
    if (containerRef.current && leftWidth === null && !isMobile) {
      const containerWidth = containerRef.current.offsetWidth;
      setLeftWidth(containerWidth * defaultRatio);
    }
  }, [defaultRatio, leftWidth, isMobile]);

  // 드래그 시작
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // 드래그 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      const maxLeftWidth = containerWidth - minRightWidth;
      const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth));

      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, minRightWidth]);

  // 모바일: 탭 UI
  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Code className="w-4 h-4" />
            에디터
          </button>
          <button
            onClick={() => setActiveTab('viewer')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'viewer'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            뷰어
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'editor' ? left : right}
        </div>
      </div>
    );
  }

  // 데스크톱: 분할 뷰
  return (
    <div
      ref={containerRef}
      className="flex flex-1 overflow-hidden"
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      {/* 왼쪽 패널 */}
      <div
        className="overflow-hidden"
        style={{ width: leftWidth ?? '50%', flexShrink: 0 }}
      >
        {left}
      </div>

      {/* 구분선 (드래그 핸들) */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 ${
          isDragging ? 'bg-blue-500' : ''
        }`}
      />

      {/* 오른쪽 패널 */}
      <div className="flex-1 overflow-hidden">{right}</div>
    </div>
  );
};
