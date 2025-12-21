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
