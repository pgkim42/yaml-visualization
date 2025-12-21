import { parse, stringify } from 'yaml';

// YAML을 JSON 문자열로 변환
export const yamlToJson = (yamlContent: string): { json: string | null; error: string | null } => {
  try {
    const data = parse(yamlContent);
    const json = JSON.stringify(data, null, 2);
    return { json, error: null };
  } catch (err) {
    return { json: null, error: (err as Error).message };
  }
};

// JSON을 YAML 문자열로 변환
export const jsonToYaml = (jsonContent: string): { yaml: string | null; error: string | null } => {
  try {
    const data = JSON.parse(jsonContent);
    const yaml = stringify(data, { indent: 2 });
    return { yaml, error: null };
  } catch (err) {
    return { yaml: null, error: (err as Error).message };
  }
};

// JSON 유효성 검사
export const isValidJson = (content: string): boolean => {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
};

// JSON 포맷팅
export const formatJson = (content: string): string | null => {
  try {
    const data = JSON.parse(content);
    return JSON.stringify(data, null, 2);
  } catch {
    return null;
  }
};
