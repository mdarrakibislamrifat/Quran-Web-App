import Link from 'next/link';

// Data fetch korar function
async function getSurahs() {
  const res = await fetch('https://api.quran.com/api/v4/chapters?language=en');
  if (!res.ok) {
    throw new Error('Failed to fetch surahs');
  }
  const data = await res.json();
  return data.chapters;
}

export default async function HomePage() {
  const surahs = await getSurahs();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Al-Quran Surah List</h1>
      
      {/* Search Input (Amra pore logic add korbo) */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search Surah..." 
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah: any) => (
          <Link 
            key={surah.id} 
            href={`/surah/${surah.id}`}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow flex justify-between items-center group bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 text-gray-600 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium group-hover:bg-green-100 group-hover:text-green-700">
                {surah.id}
              </span>
              <div>
                <p className="font-semibold text-gray-800">{surah.name_simple}</p>
                <p className="text-sm text-gray-500">{surah.translated_name.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-arabic text-gray-900">{surah.name_arabic}</p>
              <p className="text-xs text-gray-400">{surah.verses_count} Ayahs</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}