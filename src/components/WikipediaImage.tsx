"use client";
import { useEffect, useState } from "react";

export default function WikipediaImage({ title, fallbackTitle }: { title: string, fallbackTitle: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // We are strictly using Gemini for data, so we remove the Wikipedia image API entirely.
    // Instead, we instantly generate a visually pleasing generic seeded image.
    const seed = (title || fallbackTitle).replace(/\s+/g, '');
    setImageUrl(`https://picsum.photos/seed/${seed}/800/400`);
  }, [title, fallbackTitle]);

  if (!imageUrl) return <div className="absolute inset-0 bg-slate-900 animate-pulse opacity-10 pointer-events-none"></div>;

  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <img src={imageUrl} alt="" className="w-full h-full object-cover mix-blend-overlay" />
    </div>
  );
}
