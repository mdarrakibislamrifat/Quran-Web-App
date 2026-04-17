"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<"surah" | "ayah">("surah");
  const [ayahResults, setAyahResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters?language=en")
      .then((res) => res.json())
      .then((data) => setSurahs(data.chapters));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchMode === "ayah" && searchTerm.trim().length > 2) {
        setLoading(true);
        try {
          const res = await fetch(
            `https://api.quran.com/api/v4/search?query=${searchTerm}&size=10&language=en`
          );
          const data = await res.json();
          setAyahResults(data.search.results || []);
        } catch (err) {
          console.error("Ayah search failed", err);
        } finally {
          setLoading(false);
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchMode]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toString() === searchTerm
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center text-white">
        Al-Quran Surah List
      </h1>

      <div className="max-w-2xl mx-auto mb-10">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4 bg-gray-900 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => { setSearchMode("surah"); setSearchTerm(""); }}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 
            ${searchMode === "surah" ? "bg-green-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            📖 Surah
          </button>
          <button
            onClick={() => { setSearchMode("ayah"); setSearchTerm(""); }}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 
            ${searchMode === "ayah" ? "bg-green-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            🔍 Ayah
          </button>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchMode === "surah" ? "Search Surah..." : "Search Ayah..."}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all shadow-inner"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          {loading && <span className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-green-500">⏳</span>}
        </div>
      </div>

      {/* Results Section */}
      {searchMode === "surah" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/surah/${surah.id}`}
              className="p-4 bg-gray-950 border border-gray-800 rounded-2xl hover:border-green-500/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <span className="flex-shrink-0 bg-gray-800 text-gray-400 w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold group-hover:bg-green-900/40 group-hover:text-green-400 transition">
                  {surah.id}
                </span>
                <div className="truncate">
                  <p className="font-bold text-white group-hover:text-green-400 transition-colors truncate">
                    {surah.name_simple}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">
                    {surah.translated_name.name}
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-xl font-arabic text-white mb-0.5">
                  {surah.name_arabic}
                </p>
                <p className="text-[9px] text-gray-600 font-bold uppercase">
                  {surah.verses_count} Ayahs
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {ayahResults.map((result, idx) => (
            <Link
              key={idx}
              href={`/surah/${result.verse_key.split(':')[0]}#ayah-${result.verse_key.split(':')[1]}`}
              className="block p-5 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-green-500/30 transition-all"
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">
                  Verse {result.verse_key}
                </span>
                <span className="text-[10px] text-gray-500 italic">Open Surah →</span>
              </div>
              <p
                className="text-gray-300 leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: result.text }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}