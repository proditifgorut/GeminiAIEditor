import React from 'react';
import { MessageSquare, FileText, Settings, Plus, Trash2 } from 'lucide-react';
import { Conversation, FileItem } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: 'chat' | 'files' | 'settings';
  onTabChange: (tab: 'chat' | 'files' | 'settings') => void;
  conversations: Conversation[];
  files: FileItem[];
  activeConversationId: string | null;
  activeFileId: string | null;
  onConversationSelect: (id: string) => void;
  onFileSelect: (id: string) => void;
  onNewConversation: () => void;
  onNewFile: () => void;
  onDeleteConversation: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  conversations,
  files,
  activeConversationId,
  activeFileId,
  onConversationSelect,
  onFileSelect,
  onNewConversation,
  onNewFile,
  onDeleteConversation,
  onDeleteFile,
}) => {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Gemini AI Editor
        </h1>
      </div>

      <div className="flex border-b border-gray-800">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'chat' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-sm">Chat</span>
        </button>
        <button
          onClick={() => onTabChange('files')}
          className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'files' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'
          }`}
        >
          <FileText size={18} />
          <span className="text-sm">Files</span>
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'settings' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'
          }`}
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && (
          <div className="p-3">
            <button
              onClick={onNewConversation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors mb-3"
            >
              <Plus size={18} />
              <span>Percakapan Baru</span>
            </button>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group flex items-center justify-between ${
                    activeConversationId === conv.id
                      ? 'bg-gray-800 text-blue-400'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => onConversationSelect(conv.id)}
                >
                  <div className="flex-1 truncate">
                    <div className="text-sm font-medium truncate">{conv.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {conv.messages.length} pesan
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-3">
            <button
              onClick={onNewFile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors mb-3"
            >
              <Plus size={18} />
              <span>File Baru</span>
            </button>
            <div className="space-y-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group flex items-center justify-between ${
                    activeFileId === file.id
                      ? 'bg-gray-800 text-blue-400'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => onFileSelect(file.id)}
                >
                  <div className="flex-1 truncate">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{file.language}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
