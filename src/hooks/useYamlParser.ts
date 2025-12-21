import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { parseYaml, buildTree } from '../utils/yamlUtils';
import { TIMING } from '../constants';

export const useYamlParser = () => {
  const { yamlContent, setParseResult } = useStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 이전 타임아웃 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 디바운스 적용
    timeoutRef.current = setTimeout(() => {
      const { data, error } = parseYaml(yamlContent);

      if (error) {
        // 에러 시 원자적 업데이트
        setParseResult({
          data: null,
          error,
          treeData: null,
        });
      } else {
        // 성공 시 트리 데이터 생성 및 원자적 업데이트
        const treeData = data !== null && data !== undefined
          ? buildTree(data)
          : null;

        setParseResult({
          data,
          error: null,
          treeData,
        });
      }
    }, TIMING.DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [yamlContent, setParseResult]);
};
