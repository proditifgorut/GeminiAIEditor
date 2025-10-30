import React, { useState } from 'react';
import { EditorSettings } from '../types';
import { Save, Key, Palette, Type } from 'lucide-react';

interface SettingsPanelProps {
  settings: EditorSettings;
  onSaveSettings: (settings: EditorSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    onSaveSettings(localSettings);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Key size={18} />
                API Key Gemini
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={localSettings.apiKey}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, apiKey: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan API key Gemini Anda..."
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Dapatkan API key Anda di{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Palette size={18} />
                Model
              </label>
              <select
                value={localSettings.model}
                onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-pro-vision">Gemini Pro Vision</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Palette size={18} />
                Tema
              </label>
              <select
                value={localSettings.theme}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    theme: e.target.value as 'light' | 'dark',
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Terang</option>
                <option value="dark">Gelap</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Type size={18} />
                Ukuran Font
              </label>
              <input
                type="number"
                min="12"
                max="24"
                value={localSettings.fontSize}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, fontSize: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Simpan Pengaturan
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Tentang Gemini AI Editor</h3>
          <p className="text-sm text-blue-800">
            Editor cerdas dengan integrasi Gemini AI untuk membantu Anda dalam coding, writing, dan
            berbagai tugas kreatif lainnya. Dibuat dengan React, TypeScript, dan Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
};
