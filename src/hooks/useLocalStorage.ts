import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { STORAGE_KEY, TIMING } from '../constants';

interface StoredData {
  yamlContent: string;
  theme: 'light' | 'dark';
  expandedNodes: string[];
}

// localStorage에서 데이터 불러오기
export const loadFromStorage = (): Partial<StoredData> | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
};

// localStorage에 데이터 저장
const saveToStorage = (data: StoredData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const useLocalStorage = () => {
  const { yamlContent, theme, expandedNodes, setYamlContent } = useStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  // 초기 로드 (한 번만)
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const stored = loadFromStorage();
    if (stored?.yamlContent) {
      setYamlContent(stored.yamlContent);
    }
    // 테마는 store에서 시스템 설정을 따르도록 이미 설정됨
  }, [setYamlContent]);

  // 변경사항 저장 (디바운스)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToStorage({
        yamlContent,
        theme,
        expandedNodes: Array.from(expandedNodes),
      });
    }, TIMING.SAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [yamlContent, theme, expandedNodes]);
};
