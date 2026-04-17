"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<"surah" | "ayah">("surah");
  const [ayahResults, setAyahResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial Surah Load
  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters?language=en")
      .then((res) => res.json())
      .then((data) => setSurahs(data.chapters));
  }, []);

  // Ayah Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchMode === "ayah" && searchTerm.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(
            `https://api.quran.com/api/v4/search?query=${searchTerm}&size=10&language=en`, // English search er jonno 'en' use korun
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

  // Local Filter for Surahs
  const filteredSurahs = surahs.filter(
    (s) =>
      s.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toString() === searchTerm,
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Al-Quran Surah List
      </h1>

      <div className="max-w-2xl mx-auto mb-10">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4 bg-gray-900 p-1 rounded-xl shadow-inner">
  <button
    onClick={() => {
      setSearchMode("surah");
      setSearchTerm("");
    }}
    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 
    ${
      searchMode === "surah"
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    📖 Surah
  </button>

  <button
    onClick={() => {
      setSearchMode("ayah");
      setSearchTerm("");
    }}
    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 
    ${
      searchMode === "ayah"
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    🔍 Ayah
  </button>
</div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchMode === "surah"
                ? "Type Surah Name (e.g. Fatihah)..."
                : "Search Ayah Text (e.g. Allah, Mercy)..."
            }
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          <span className="absolute left-4 top-4 text-gray-500">🔍</span>
          {loading && (
            <span className="absolute right-4 top-4 animate-spin text-green-500">
              ⏳
            </span>
          )}
        </div>
      </div>

      {/* Results Section */}
      {searchMode === "surah" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/surah/${surah.id}`}
              className="p-5 border border-gray-800 rounded-xl hover:border-green-500/50 hover:bg-gray-900 transition-all flex justify-between items-center group bg-gray-950"
            >
              <div className="flex items-center gap-4">
                <span className="bg-gray-800 text-gray-400 w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold group-hover:bg-green-900 group-hover:text-green-400 transition">
                  {surah.id}
                </span>
                <div>
                  <p className="font-bold text-white group-hover:text-green-400">
                    {surah.name_simple}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {surah.translated_name.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-arabic text-white mb-1">
                  {surah.name_arabic}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
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
              className="block p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-500/40 transition-all group"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest px-2 py-1 bg-green-500/10 rounded">
                  Verse {result.verse_key}
                </span>
                <span className="text-[10px] text-gray-500 italic">
                  Click to read full Surah
                </span>
              </div>

             
              <p
                className="text-gray-300 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: result.text }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
