
import ScrollToAyah from "@/components/ScrollToAyah";
import Link from "next/link";

async function getSurahDetail(id: string) {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${id}?language=en&words=false&translations=161&fields=text_uthmani&per_page=300`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) throw new Error("Failed to fetch surah details");
  
  const data = await res.json();
  return data.verses; 
}

export default async function SurahDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params; 
  const verses = await getSurahDetail(id);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-black min-h-screen text-white">
        <ScrollToAyah />
      <Link href="/" className="text-green-500 mb-8 inline-block hover:underline font-semibold">
        ← Back to Surah List
      </Link>

      <div className="space-y-12 pb-20">
        {verses.map((verse: any) => (
          <div key={verse.id} id={`ayah-${verse.verse_number}`} className="pb-10 border-b border-gray-800 last:border-0">
            {/* Arabic Text */}
            <div className="flex flex-col items-end w-full mb-6">
              <p className="text-right leading-[3] font-arabic " translate="no" 
                 style={{ fontSize: "var(--arabic-font-size, 32px)", fontFamily: "var(--arabic-font-family, 'Amiri', serif)" }}>
                <span className="inline-flex items-center justify-center bg-white text-black text-[14px] w-8 h-8 rounded-full mr-4 align-middle font-bold">
                  {verse.verse_number}
                </span>
                <span dir="rtl">{verse.text_uthmani}</span>
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed text-left" 
               style={{ fontSize: "var(--translation-font-size, 18px)" }}
               dangerouslySetInnerHTML={{ __html: verse.translations?.[0]?.text || "Translation not found" }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}