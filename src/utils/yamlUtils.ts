import { parse, stringify, LineCounter, parseDocument } from 'yaml';
import type { TreeNodeData, YamlError } from '../types';

// YAML 문자열을 파싱
export const parseYaml = (content: string): { data: unknown; error: YamlError | null } => {
  try {
    const data = parse(content);
    return { data, error: null };
  } catch (err) {
    const error = err as Error & { linePos?: { line: number; col: number }[] };
    return {
      data: null,
      error: {
        message: error.message,
        line: error.linePos?.[0]?.line,
        column: error.linePos?.[0]?.col,
      },
    };
  }
};

// 객체를 YAML 문자열로 변환
export const stringifyYaml = (data: unknown): string => {
  return stringify(data, { indent: 2 });
};

// 값의 타입을 결정
const getValueType = (value: unknown): TreeNodeData['type'] => {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
};

// 파싱된 데이터를 트리 구조로 변환
export const buildTree = (
  data: unknown,
  key: string = 'root',
  path: string = 'root',
  depth: number = 0
): TreeNodeData => {
  const type = getValueType(data);

  let children: TreeNodeData[] = [];

  if (type === 'object' && data !== null) {
    children = Object.entries(data as Record<string, unknown>).map(
      ([childKey, childValue]) =>
        buildTree(childValue, childKey, `${path}.${childKey}`, depth + 1)
    );
  } else if (type === 'array' && Array.isArray(data)) {
    children = data.map((item, index) =>
      buildTree(item, `[${index}]`, `${path}[${index}]`, depth + 1)
    );
  }

  return {
    key,
    value: data,
    type,
    path,
    depth,
    children,
  };
};

// 소스 위치 정보를 포함한 트리 빌드
export const buildTreeWithLineInfo = (content: string): TreeNodeData | null => {
  try {
    const lineCounter = new LineCounter();
    const doc = parseDocument(content, { lineCounter });

    if (!doc.contents) return null;

    const buildNodeWithPos = (
      node: unknown,
      key: string,
      path: string,
      depth: number,
      range?: [number, number, number]
    ): TreeNodeData => {
      const value = node && typeof node === 'object' && 'toJSON' in node
        ? (node as { toJSON: () => unknown }).toJSON()
        : node;
      const type = getValueType(value);

      let line: number | undefined;
      let column: number | undefined;

      if (range) {
        const pos = lineCounter.linePos(range[0]);
        line = pos.line;
        column = pos.col;
      }

      let children: TreeNodeData[] = [];

      if (node && typeof node === 'object' && 'items' in node) {
        const items = (node as { items: unknown[] }).items;

        if (type === 'object') {
          children = items.map((item) => {
            const pair = item as { key: { value: string; range: [number, number, number] }; value: { value: unknown; range: [number, number, number] } };
            return buildNodeWithPos(
              pair.value,
              String(pair.key?.value ?? ''),
              `${path}.${pair.key?.value ?? ''}`,
              depth + 1,
              pair.value?.range
            );
          });
        } else if (type === 'array') {
          children = items.map((item, index) => {
            const seqItem = item as { value: unknown; range: [number, number, number] };
            return buildNodeWithPos(
              seqItem,
              `[${index}]`,
              `${path}[${index}]`,
              depth + 1,
              seqItem?.range
            );
          });
        }
      }

      return {
        key,
        value,
        type,
        path,
        depth,
        children,
        line,
        column,
      };
    };

    const contents = doc.contents as unknown as { range: [number, number, number] };
    return buildNodeWithPos(doc.contents, 'root', 'root', 0, contents?.range);
  } catch {
    return null;
  }
};

// YAML 포맷팅 (정렬)
export const formatYaml = (content: string): string | null => {
  try {
    const data = parse(content);
    return stringify(data, { indent: 2 });
  } catch {
    return null;
  }
};
