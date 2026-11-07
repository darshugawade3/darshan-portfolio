
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, X, Award, Pencil } from "lucide-react";
import { achievementsService } from "@/lib/db";
import { useAchievements } from "@/hooks/usePortfolioData";
import type { Achievement } from "@/types";

type AchievementForm = Omit<Achievement, "id">;

const EMPTY: AchievementForm = {
  title: "",
  description: "",
  category: "Award",
  year: String(new Date().getFullYear()),
  icon: "🏆",
  order: 0,
};

export default function AchievementsAdminPage() {
  const { achievements, loading, refresh } = useAchievements();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<AchievementForm>({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...EMPTY,
      order: achievements.length,
      year: String(new Date().getFullYear()),
    });
    setShowModal(true);
  };

  const openEdit = (item: Achievement) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      year: item.year,
      icon: item.icon,
      order: item.order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Achievement title is required.");
      return;
    }

    if (!form.category.trim() || !form.year.trim()) {
      toast.error("Category and year are required.");
      return;
    }

    setSaving(true);

    try {
      const data: AchievementForm = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        year: form.year.trim(),
        icon: form.icon.trim() || "🏆",
        order: Number(form.order) || 0,
      };

      if (editing) {
        await achievementsService.update(editing.id, data);
        toast.success("Achievement updated!");
      } else {
        await achievementsService.add(data);
        toast.success("Achievement added!");
      }

      await refresh();
      setShowModal(false);
      setEditing(null);
    } catch (error) {
      console.error("Achievement save error:", error);
      toast.error("Failed to save achievement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      await achievementsService.delete(id);
      await refresh();
      toast.success("Achievement deleted!");
    } catch (error) {
      console.error("Achievement delete error:", error);
      toast.error("Failed to delete achievement.");
    }
  };

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-black mb-1"
            style={{
              fontFamily: "Exo 2, sans-serif",
              color: "#f8fafc",
            }}
          >
            Achievements & Awards
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: ".875rem",
              fontFamily: "Exo 2, sans-serif",
            }}
          >
            {achievements.length} achievement
            {achievements.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Add Achievement
        </button>
      </div>

      {/* Achievement List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="glass p-12 text-center">
          <Award
            size={42}
            style={{
              color: "#fbbf24",
              margin: "0 auto 12px",
              opacity: 0.6,
            }}
          />

          <p
            style={{
              color: "#64748b",
              fontFamily: "Exo 2, sans-serif",
            }}
          >
            No achievements yet. Click Add Achievement.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass p-5 hover:scale-[1.01] transition-transform"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-3xl"
                style={{
                  background: "rgba(251,191,36,.08)",
                  border: "1px solid rgba(251,191,36,.2)",
                }}
              >
                {item.icon || "🏆"}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(34,211,238,.1)",
                    color: "#22d3ee",
                  }}
                >
                  {item.category}
                </span>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: ".75rem",
                  }}
                >
                  {item.year}
                </span>
              </div>

              <h3
                style={{
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: ".95rem",
                  fontFamily: "Exo 2, sans-serif",
                  marginBottom: "8px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: ".8rem",
                  lineHeight: 1.6,
                  minHeight: "48px",
                }}
              >
                {item.description}
              </p>

              <p
                style={{
                  color: "#64748b",
                  fontSize: ".7rem",
                  marginTop: "10px",
                }}
              >
                Display order: {item.order}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(item)}
                  className="btn-secondary flex-1 justify-center"
                  style={{ padding: "7px", fontSize: ".78rem" }}
                >
                  <Pencil size={13} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="btn-danger"
                  style={{ padding: "7px 10px" }}
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowModal(false)
          }
        >
          <div className="modal-box">

            <div className="flex justify-between items-center mb-5">
              <h2
                className="text-xl font-black"
                style={{
                  fontFamily: "Exo 2, sans-serif",
                  color: "#f8fafc",
                }}
              >
                {editing ? "Edit Achievement" : "Add Achievement"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  color: "#64748b",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="form-label">
                  Achievement Title *
                </label>

                <input
                  className="form-input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g. Academic Excellence Award"
                />
              </div>

              <div>
                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-input"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your achievement..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <label className="form-label">
                    Category *
                  </label>

                  <input
                    className="form-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Award / Research / Academic"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Year *
                  </label>

                  <input
                    className="form-input"
                    value={form.year}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        year: e.target.value,
                      }))
                    }
                    placeholder="2026"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Icon (Emoji)
                  </label>

                  <input
                    className="form-input"
                    value={form.icon}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="🏆"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={form.order}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        order: Number(e.target.value),
                      }))
                    }
                  />
                </div>

              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 justify-center"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Achievement"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
