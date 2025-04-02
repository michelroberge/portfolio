import { FC } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

declare const MarkdownEditor: FC<MarkdownEditorProps>;
export default MarkdownEditor;
