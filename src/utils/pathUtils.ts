/**
 * 트리 경로를 부모 경로 배열로 분해
 * 예: "root.items[0].name" → ["root", "root.items", "root.items[0]"]
 */
export const getParentPaths = (path: string): string[] => {
  const segments: string[] = [];
  let current = '';
  let i = 0;

  while (i < path.length) {
    const char = path[i];

    if (char === '.') {
      // 점을 만나면 현재까지의 경로를 저장
      if (current) {
        segments.push(current);
      }
      i++;
    } else if (char === '[') {
      // 배열 인덱스 시작
      const closeIndex = path.indexOf(']', i);
      if (closeIndex !== -1) {
        current += path.slice(i, closeIndex + 1);
        segments.push(current);
        i = closeIndex + 1;
        // 다음 문자가 .이면 건너뛰기
        if (path[i] === '.') {
          i++;
        }
      } else {
        current += char;
        i++;
      }
    } else {
      current += char;
      i++;
    }
  }

  // 마지막 세그먼트 제외 (현재 노드 자체는 펼칠 필요 없음)
  return segments.slice(0, -1);
};

/**
 * 경로를 세그먼트 배열로 분해
 * 예: "root.items[0].name" → ["root", "items", "[0]", "name"]
 */
export const parsePathSegments = (path: string): string[] => {
  const regex = /([^.\[\]]+|\[\d+\])/g;
  const matches = path.match(regex);
  return matches || [];
};

/**
 * root. 접두사 제거
 * 예: "root.spring.datasource" → "spring.datasource"
 */
export const removeRootPrefix = (path: string): string => {
  if (path === 'root') return '';
  if (path.startsWith('root.')) {
    return path.slice(5);
  }
  return path;
};

/**
 * 점 표기법으로 변환
 * 예: "root.spring.datasource[0].url" → "spring.datasource[0].url"
 */
export const formatDotNotation = (path: string): string => {
  return removeRootPrefix(path);
};

/**
 * 배열 표기법으로 변환
 * 예: "root.spring.datasource[0].url" → "['spring']['datasource'][0]['url']"
 */
export const formatBracketNotation = (path: string): string => {
  const cleanPath = removeRootPrefix(path);
  if (!cleanPath) return '';
  
  // 세그먼트 분해
  const segments = parsePathSegments(cleanPath);
  
  return segments
    .map((seg) => {
      // 이미 배열 인덱스인 경우 ([0], [1] 등)
      if (seg.startsWith('[') && seg.endsWith(']')) {
        return seg;
      }
      // 일반 키는 ['key'] 형태로
      return `['${seg}']`;
    })
    .join('');
};

/**
 * 경로를 지정된 형식으로 변환
 */
export const formatPath = (path: string, format: 'dot' | 'bracket'): string => {
  if (format === 'dot') {
    return formatDotNotation(path);
  }
  return formatBracketNotation(path);
};
