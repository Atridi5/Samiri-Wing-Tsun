"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2, ArrowUp, ArrowDown } from "lucide-react";

type GalleryImage = { id: string; url: string; caption: string | null; category: string; order: number };

const CATEGORIES = [
  { value: "general", label: "Përgjithshme" },
  { value: "hall", label: "Salla" },
  { value: "group", label: "Grupet" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) {
      setUploading(false);
      alert("Ngarkimi dështoi.");
      return;
    }
    const { url } = await uploadRes.json();

    const createRes = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, caption: "", category: "general", order: images.length }),
    });
    setUploading(false);
    if (createRes.ok) {
      const newImage = await createRes.json();
      setImages((prev) => [...prev, newImage]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë foto?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function handleCaptionChange(id: string, caption: string) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, caption } : img)));
  }

  async function saveCaption(image: GalleryImage) {
    await fetch(`/api/admin/gallery/${image.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption: image.caption, category: image.category, order: image.order }),
    });
  }

  async function handleCategoryChange(image: GalleryImage, category: string) {
    setImages((prev) => prev.map((img) => (img.id === image.id ? { ...img, category } : img)));
    await fetch(`/api/admin/gallery/${image.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption: image.caption, category, order: image.order }),
    });
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const withOrders = reordered.map((img, i) => ({ ...img, order: i }));
    setImages(withOrders);
    await Promise.all(
      withOrders.map((img) =>
        fetch(`/api/admin/gallery/${img.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption: img.caption, category: img.category, order: img.order }),
        })
      )
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Duke ngarkuar...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galeria</h1>
          <p className="mt-1 text-sm text-slate-500">Ngarko dhe menaxho fotot që shfaqen në faqe.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Duke ngarkuar..." : "Ngarko Foto"}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={uploading} />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div key={image.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="relative h-48 w-full bg-slate-100">
              <Image src={image.url} alt={image.caption ?? ""} fill className="object-cover" />
            </div>
            <div className="p-4">
              <input
                value={image.caption ?? ""}
                onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                onBlur={() => saveCaption(image)}
                placeholder="Përshkrimi (opsional)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#d4af37]"
              />
              <select
                value={image.category}
                onChange={(e) => handleCategoryChange(image, e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#d4af37]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" /> Fshi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          Nuk ka ende foto në galeri.
        </p>
      )}
    </div>
  );
}
