import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { FileEditor } from './components/FileEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { Conversation, FileItem, EditorSettings, Message } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { geminiService } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'settings'>('chat');
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [files, setFiles] = useLocalStorage<FileItem[]>('files', []);
  const [settings, setSettings] = useLocalStorage<EditorSettings>('settings', {
    theme: 'light',
    fontSize: 14,
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: 'gemini-pro',
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings.apiKey && settings.apiKey !== 'YOUR_API_KEY') {
      geminiService.initialize(settings.apiKey, settings.model);
    }
  }, [settings.apiKey, settings.model]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeFile = files.find((f) => f.id === activeFileId);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `Percakapan ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
  };

  const handleNewFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `file-${files.length + 1}.txt`,
      content: '',
      language: 'text',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFiles([newFile, ...files]);
    setActiveFileId(newFile.id);
    setActiveTab('files');
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;

    if (!settings.apiKey || settings.apiKey === 'YOUR_API_KEY') {
      setError('Silakan tambahkan API key Gemini di pengaturan');
      setActiveTab('settings');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          updatedAt: new Date(),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setIsLoading(true);
    setError(null);

    try {
      let assistantContent = '';
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      await geminiService.streamGenerateContent(content, (chunk) => {
        assistantContent += chunk;
        assistantMessage.content = assistantContent;

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === activeConversationId) {
              const existingAssistant = conv.messages.find((m) => m.id === assistantMessage.id);
              if (existingAssistant) {
                return {
                  ...conv,
                  messages: conv.messages.map((m) =>
                    m.id === assistantMessage.id ? assistantMessage : m
                  ),
                };
              } else {
                return {
                  ...conv,
                  messages: [...conv.messages, assistantMessage],
                };
              }
            }
            return conv;
          })
        );
      });

      const finalConversations = conversations.map((conv) => {
        if (conv.id === activeConversationId && conv.messages.length === 1) {
          const firstWords = content.split(' ').slice(0, 5).join(' ');
          return {
            ...conv,
            title: firstWords + (content.split(' ').length > 5 ? '...' : ''),
          };
        }
        return conv;
      });
      setConversations(finalConversations);
    } catch (err) {
      setError('Terjadi kesalahan saat berkomunikasi dengan Gemini AI');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    if (activeFileId === id) {
      setActiveFileId(null);
    }
  };

  const handleSaveFile = (content: string) => {
    if (!activeFileId) return;
    setFiles(
      files.map((f) => (f.id === activeFileId ? { ...f, content, updatedAt: new Date() } : f))
    );
  };

  const handleUpdateFileName = (name: string) => {
    if (!activeFileId) return;
    setFiles(files.map((f) => (f.id === activeFileId ? { ...f, name } : f)));
  };

  const handleUpdateFileLanguage = (language: string) => {
    if (!activeFileId) return;
    setFiles(files.map((f) => (f.id === activeFileId ? { ...f, language } : f)));
  };

  const handleSaveSettings = (newSettings: EditorSettings) => {
    setSettings(newSettings);
    setError(null);
    if (newSettings.apiKey && newSettings.apiKey !== 'YOUR_API_KEY') {
      geminiService.initialize(newSettings.apiKey, newSettings.model);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conversations={conversations}
        files={files}
        activeConversationId={activeConversationId}
        activeFileId={activeFileId}
        onConversationSelect={setActiveConversationId}
        onFileSelect={setActiveFileId}
        onNewConversation={handleNewConversation}
        onNewFile={handleNewFile}
        onDeleteConversation={handleDeleteConversation}
        onDeleteFile={handleDeleteFile}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {activeTab === 'chat' && (
          <>
            {activeConversation ? (
              <ChatPanel
                messages={activeConversation.messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Pilih atau Buat Percakapan Baru
                  </h2>
                  <button
                    onClick={handleNewConversation}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Mulai Percakapan
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'files' && (
          <>
            {activeFile ? (
              <FileEditor
                file={activeFile}
                onSave={handleSaveFile}
                onUpdateName={handleUpdateFileName}
                onUpdateLanguage={handleUpdateFileLanguage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Pilih atau Buat File Baru
                  </h2>
                  <button
                    onClick={handleNewFile}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Buat File Baru
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <SettingsPanel settings={settings} onSaveSettings={handleSaveSettings} />
        )}
      </div>
    </div>
  );
}

export default App;
