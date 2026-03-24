"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface GalleryImage {
  id: string;
  imageUrl: string;
  category: string | null;
}

export default function GalleryManager({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!imageUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          category: category.trim() || null,
        }),
      });
      if (res.ok) {
        const newImg = await res.json();
        setImages((i) => [newImg, ...i]);
        setImageUrl("");
        setCategory("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages((i) => i.filter((x) => x.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-stone-200">
        <h3 className="font-semibold mb-4">Add Image (Cloudinary URL)</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            placeholder="Image URL (e.g. https://res.cloudinary.com/...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-stone-300 rounded-lg"
          />
          <input
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg w-full sm:w-40"
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-stone-200 group"
          >
            <img
              src={img.imageUrl}
              alt={img.category || "Gallery"}
              className="w-full h-full object-cover"
            />
            {img.category && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2">
                {img.category}
              </div>
            )}
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-center text-stone-500 py-8">No images yet</p>
      )}
    </div>
  );
}
