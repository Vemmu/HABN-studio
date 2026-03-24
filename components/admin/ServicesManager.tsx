"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  branchId?: string;
  branch?: { name: string };
}

interface Branch {
  id: string;
  name: string;
}

export default function ServicesManager({
  initialServices,
  branches = [],
  currentBranchId,
  isSuperAdmin,
}: {
  initialServices: Service[];
  branches?: Branch[];
  currentBranchId: string | null;
  isSuperAdmin: boolean;
}) {
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; description: string; price: string; duration: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    branchId: currentBranchId || (branches[0]?.id ?? ""),
  });

  const effectiveBranchId = isSuperAdmin ? form.branchId : currentBranchId;
  if (!effectiveBranchId && !isSuperAdmin) return null;

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.duration || !effectiveBranchId) return;
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price),
          duration: parseInt(form.duration, 10),
          branchId: effectiveBranchId,
        }),
      });
      if (res.ok) {
        const newService = await res.json();
        const branch = branches.find((b) => b.id === newService.branchId);
        setServices((s) => [...s, { ...newService, branch: branch ? { name: branch.name } : undefined }]);
        setForm({ name: "", description: "", price: "", duration: "", branchId: effectiveBranchId });
        setShowForm(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Service>) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        const existing = services.find((x) => x.id === id);
        setServices((s) =>
          s.map((x) =>
            x.id === id
              ? { ...updated, branch: updated.branch ?? existing?.branch }
              : x
          )
        );
        setEditing(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((s) => s.filter((x) => x.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (s: Service) => {
    setEditing(s.id);
    setEditForm({
      name: s.name,
      description: s.description ?? "",
      price: String(s.price),
      duration: String(s.duration),
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editing || !editForm || !editForm.name || !editForm.price || !editForm.duration) return;
    try {
      const res = await fetch(`/api/services/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim() || null,
          price: parseFloat(editForm.price),
          duration: parseInt(editForm.duration, 10),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        const existing = services.find((x) => x.id === editing);
        setServices((s) =>
          s.map((x) =>
            x.id === editing
              ? { ...updated, branch: updated.branch ?? existing?.branch }
              : x
          )
        );
        cancelEdit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
      >
        <Plus size={20} />
        Add Service
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <h3 className="font-semibold mb-4">New Service</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {isSuperAdmin && branches.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Branch</label>
                <select
                  value={form.branchId}
                  onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Duration (min)"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-stone-200 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              {isSuperAdmin && <th className="text-left p-4 font-semibold">Branch</th>}
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Duration</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-stone-100">
                {editing === s.id && editForm ? (
                  <>
                    <td className="p-4">
                      <div className="space-y-2">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm((f) => f && { ...f, name: e.target.value })}
                          className="px-3 py-2 border border-stone-200 rounded-lg w-full max-w-[200px]"
                          placeholder="Name"
                        />
                        <input
                          value={editForm.description}
                          onChange={(e) => setEditForm((f) => f && { ...f, description: e.target.value })}
                          className="px-3 py-2 border border-stone-200 rounded-lg w-full max-w-[200px] text-sm"
                          placeholder="Description"
                        />
                      </div>
                    </td>
                    {isSuperAdmin && <td className="p-4 text-stone-600">{s.branch?.name ?? branches.find((b) => b.id === s.branchId)?.name ?? "—"}</td>}
                    <td className="p-4">
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm((f) => f && { ...f, price: e.target.value })}
                        className="px-3 py-2 border border-stone-200 rounded-lg w-24"
                        placeholder="Price"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={editForm.duration}
                        onChange={(e) => setEditForm((f) => f && { ...f, duration: e.target.value })}
                        className="px-3 py-2 border border-stone-200 rounded-lg w-24"
                        placeholder="Duration"
                      />
                    </td>
                    <td className="p-4">—</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-stone-500 hover:bg-stone-100 rounded transition-colors"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">{s.name}</td>
                    {isSuperAdmin && (
                      <td className="p-4 text-stone-600">
                        {s.branch?.name ?? branches.find((b) => b.id === s.branchId)?.name ?? "—"}
                      </td>
                    )}
                    <td className="p-4">{formatPrice(s.price)}</td>
                    <td className="p-4">{s.duration} min</td>
                    <td className="p-4">
                      <select
                        value={s.isActive ? "active" : "inactive"}
                        onChange={(e) =>
                          handleUpdate(s.id, {
                            isActive: e.target.value === "active",
                          })
                        }
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => startEdit(s)}
                        className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
