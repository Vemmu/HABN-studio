"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  isActive: boolean;
}

export default function ProductsManager({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.imageUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          imageUrl: form.imageUrl.trim(),
        }),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((p) => [newProduct, ...p]);
        setForm({ name: "", description: "", imageUrl: "" });
        setShowForm(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((p) => p.filter((x) => x.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((p) => p.map((x) => (x.id === id ? updated : x)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
      >
        <Plus size={20} />
        Add Product
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <h3 className="font-semibold mb-4">New Product</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Product name"
                className="w-full px-4 py-2 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Product description"
                rows={3}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-stone-200 rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-stone-200 px-4 py-2 rounded-lg hover:bg-stone-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden group"
          >
            <div className="aspect-square bg-stone-100 relative">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleActive(p.id, p.isActive)}
                  className={`px-2 py-1 rounded text-xs ${
                    p.isActive ? "bg-green-600 text-white" : "bg-stone-500 text-white"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 bg-red-600 text-white rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-stone-800 truncate">{p.name}</p>
              {p.description && (
                <p className="text-sm text-stone-500 line-clamp-2 mt-0.5">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-stone-500 py-12">No products yet</p>
      )}
    </div>
  );
}
