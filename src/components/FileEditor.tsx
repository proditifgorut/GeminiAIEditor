import React, { useState, useEffect } from 'react';
import { FileItem } from '../types';
import { Save, Eye, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileEditorProps {
  file: FileItem;
  onSave: (content: string) => void;
  onUpdateName: (name: string) => void;
  onUpdateLanguage: (language: string) => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({
  file,
  onSave,
  onUpdateName,
  onUpdateLanguage,
}) => {
  const [content, setContent] = useState(file.content);
  const [name, setName] = useState(file.name);
  const [language, setLanguage] = useState(file.language);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(file.content);
    setName(file.name);
    setLanguage(file.language);
    setHasChanges(false);
  }, [file]);

  const handleSave = () => {
    onSave(content);
    onUpdateName(name);
    onUpdateLanguage(language);
    setHasChanges(false);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setHasChanges(true);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama file..."
        />
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setHasChanges(true);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="markdown">Markdown</option>
          <option value="json">JSON</option>
          <option value="text">Text</option>
        </select>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          {previewMode ? <Code size={18} /> : <Eye size={18} />}
          <span className="hidden sm:inline">{previewMode ? 'Editor' : 'Preview'}</span>
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Save size={18} />
          <span className="hidden sm:inline">Simpan</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {previewMode ? (
          <div className="h-full overflow-y-auto p-4">
            {language === 'markdown' ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;
                      return !isInline ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <SyntaxHighlighter language={language} style={vscDarkPlus}>
                {content}
              </SyntaxHighlighter>
            )}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="Mulai mengetik..."
          />
        )}
      </div>
    </div>
  );
};
