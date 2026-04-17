"use client";
import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

const Sidebar = () => {
  const [arabicFont, setArabicFont] = useState('font-amiri');
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //  Settings persist 
  useEffect(() => {
    setMounted(true);
    const savedSettings = localStorage.getItem('quran-settings');
    if (savedSettings) {
      const { font, aSize, tSize } = JSON.parse(savedSettings);
      setArabicFont(font);
      setArabicFontSize(aSize);
      setTranslationFontSize(tSize);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty('--arabic-font-size', `${arabicFontSize}px`);
      document.documentElement.style.setProperty('--translation-font-size', `${translationFontSize}px`);
      document.documentElement.style.setProperty('--arabic-font-family', arabicFont === 'font-amiri' ? "'Amiri', serif" : "'Scheherazade New', serif");
    }
  }, [arabicFontSize, translationFontSize, arabicFont, mounted]);

  if (!mounted) return null;

  const saveSettings = (font: string, aSize: number, tSize: number) => {
    localStorage.setItem('quran-settings', JSON.stringify({ font, aSize, tSize }));
  };

  return (
    <aside className="w-64 h-screen bg-gray-800 p-5 fixed right-0 top-0 border-l">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      
      <div className="mb-6">
        <label className="block mb-2">Arabic Font</label>
        <select 
          className="w-full p-2 border rounded bg-slate-800"
          value={arabicFont}
          onChange={(e) => {
            setArabicFont(e.target.value);
            saveSettings(e.target.value, arabicFontSize, translationFontSize);
          }}
        >
          <option value="font-amiri">Amiri</option>
          <option value="font-scheherazade">Scheherazade</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Arabic Font Size ({arabicFontSize}px)</label>
        <input 
          type="range" min="16" max="48" 
          value={arabicFontSize}
          onChange={(e) => {
            setArabicFontSize(parseInt(e.target.value));
            saveSettings(arabicFont, parseInt(e.target.value), translationFontSize);
          }}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Translation Font Size ({translationFontSize}px)</label>
        <input 
          type="range" min="12" max="30" 
          value={translationFontSize}
          onChange={(e) => {
            setTranslationFontSize(parseInt(e.target.value));
            saveSettings(arabicFont, arabicFontSize, parseInt(e.target.value));
          }}
          className="w-full"
        />
      </div>
    </aside>
  );
};

export default Sidebar;