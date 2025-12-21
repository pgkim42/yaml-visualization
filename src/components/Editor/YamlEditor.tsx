import { useRef, useEffect } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useStore } from '../../store/useStore';

export const YamlEditor = () => {
  const { yamlContent, setYamlContent, parseError, theme } = useStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // 에디터 포커스
    editor.focus();
  };

  const handleChange: OnChange = (value) => {
    if (value !== undefined) {
      setYamlContent(value);
    }
  };

  // 에러 마커 표시
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    if (parseError && parseError.line) {
      monacoRef.current.editor.setModelMarkers(model, 'yaml', [
        {
          startLineNumber: parseError.line,
          startColumn: parseError.column ?? 1,
          endLineNumber: parseError.line,
          endColumn: parseError.column ? parseError.column + 1 : model.getLineMaxColumn(parseError.line),
          message: parseError.message,
          severity: monacoRef.current.MarkerSeverity.Error,
        },
      ]);
    } else {
      monacoRef.current.editor.setModelMarkers(model, 'yaml', []);
    }
  }, [parseError]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={yamlContent}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
};
