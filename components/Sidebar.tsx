"use client";
import { useState, useEffect } from "react";
import { Settings, X, Type, Languages, ArrowLeftRight } from "lucide-react";

const Sidebar = () => {
  const [arabicFont, setArabicFont] = useState("font-amiri");
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load Settings
  useEffect(() => {
    setMounted(true);
    const savedSettings = localStorage.getItem("quran-settings");
    if (savedSettings) {
      const { font, aSize, tSize } = JSON.parse(savedSettings);
      setArabicFont(font || "font-amiri");
      setArabicFontSize(aSize || 24);
      setTranslationFontSize(tSize || 16);
    }
  }, []);

  // Update CSS Variables
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.style.setProperty("--arabic-font-size", `${arabicFontSize}px`);
      root.style.setProperty("--translation-font-size", `${translationFontSize}px`);
      
      const selectedFont = arabicFont === "font-amiri" 
        ? "'Amiri', serif" 
        : "'Scheherazade New', serif";
      
      root.style.setProperty("--arabic-font-family", selectedFont);

      // Save to localStorage whenever values change
      localStorage.setItem("quran-settings", JSON.stringify({
        font: arabicFont,
        aSize: arabicFontSize,
        tSize: translationFontSize
      }));
    }
  }, [arabicFontSize, translationFontSize, arabicFont, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all md:hidden"
      >
        {isOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed right-0 top-0 h-screen w-72 bg-slate-900/95 backdrop-blur-md border-l border-slate-700 z-40
        transition-transform duration-300 ease-in-out p-6 shadow-2xl
        ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Settings className="text-green-500" size={20} />
            <h2 className="text-xl font-bold text-white tracking-wide">Settings</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Font Selection */}
          <section className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Type size={16} className="text-green-500" />
              Arabic Font Style
            </label>
            <select
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 outline-none transition-all cursor-pointer hover:bg-slate-750"
              value={arabicFont}
              onChange={(e) => setArabicFont(e.target.value)}
            >
              <option value="font-amiri">Amiri (Classic)</option>
              <option value="font-scheherazade">Scheherazade New</option>
            </select>
          </section>

          {/* Arabic Font Size */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Languages size={16} className="text-green-500" />
                Arabic Size
              </label>
              <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-green-400">{arabicFontSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </section>

          {/* Translation Font Size */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <ArrowLeftRight size={16} className="text-green-500" />
                Translation Size
              </label>
              <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-green-400">{translationFontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </section>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">
            Developed By Rakib Islam Rifat
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;