// 파일 다운로드
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// YAML 파일 다운로드
export const downloadYaml = (content: string, filename: string = 'document.yaml'): void => {
  downloadFile(content, filename, 'text/yaml');
};

// JSON 파일 다운로드
export const downloadJson = (content: string, filename: string = 'document.json'): void => {
  downloadFile(content, filename, 'application/json');
};

// 파일 읽기 (Promise 반환)
export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// 파일 업로드 핸들러 (input element 생성)
export const openFileDialog = (
  accept: string = '.yaml,.yml,.json',
  onFileLoad: (content: string, filename: string) => void
): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;

  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const content = await readFile(file);
        onFileLoad(content, file.name);
      } catch (error) {
        console.error('Failed to read file:', error);
      }
    }
  };

  input.click();
};

// 클립보드에 복사
export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};
