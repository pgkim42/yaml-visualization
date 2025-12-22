import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ViewerTabs } from './ViewerTabs';
import { TreeViewer } from './TreeViewer';

// 동적 import로 번들 최적화
const TreemapViewer = lazy(() => import('./TreemapViewer'));
const SunburstViewer = lazy(() => import('./SunburstViewer'));
const MindmapViewer = lazy(() => import('./MindmapViewer'));

// 로딩 폴백 컴포넌트
const LoadingFallback = () => (
  <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-xs">Loading...</span>
    </div>
  </div>
);

export const ViewerContainer = () => {
  const { currentViewer } = useStore();

  const renderViewer = () => {
    switch (currentViewer) {
      case 'tree':
        return <TreeViewer />;
      case 'treemap':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TreemapViewer />
          </Suspense>
        );
      case 'sunburst':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SunburstViewer />
          </Suspense>
        );
      case 'mindmap':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MindmapViewer />
          </Suspense>
        );
      default:
        return <TreeViewer />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ViewerTabs />
      <div className="flex-1 overflow-hidden">
        {renderViewer()}
      </div>
    </div>
  );
};
