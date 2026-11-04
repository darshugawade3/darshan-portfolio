"use client";
// src/app/admin/skills/page.tsx
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, Zap } from "lucide-react";
import { skillsService } from "@/lib/db";
import { useSkills } from "@/hooks/usePortfolioData";
import type { Skill } from "@/types";

const CATEGORIES = [
  { value: "programming", label: "Programming", color: "#22d3ee" },
  { value: "analytics", label: "Analytics & BI", color: "#fbbf24" },
  { value: "research", label: "Research Skills", color: "#34d399" },
  { value: "professional", label: "Professional Tools", color: "#a78bfa" },
];

const EMPTY_SKILL: Omit<Skill, "id"> = {
  name: "", level: 75, category: "programming", order: 0,
};

export default function SkillsAdminPage() {
  const { skills, loading, refresh } = useSkills();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Omit<Skill, "id">>(EMPTY_SKILL);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_SKILL, order: skills.length }); setShowModal(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, level: s.level, category: s.category, icon: s.icon, order: s.order }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error("Skill name is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await skillsService.update(editing.id, form);
        toast.success("Skill updated!");
      } else {
        await skillsService.add(form);
        toast.success("Skill added!");
      }
      await refresh();
      setShowModal(false);
    } catch { toast.error("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await skillsService.delete(id);
      toast.success("Skill deleted.");
      await refresh();
    } catch { toast.error("Delete failed."); }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = skills.filter((s) => s.category === cat.value);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>
            Skills Management
          </h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
            {skills.length} skills across {CATEGORIES.length} categories
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {CATEGORIES.map(({ value, label, color }) => (
            <div key={value} className="glass p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} style={{ color }} />
                <h3 className="font-bold" style={{ color, fontFamily: "Exo 2, sans-serif", fontSize: ".9rem" }}>
                  {label}
                </h3>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}18`, color }}
                >
                  {grouped[value]?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {(grouped[value] || []).map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span style={{ color: "#cbd5e1", fontSize: ".85rem", fontFamily: "Exo 2, sans-serif", fontWeight: 500 }}>
                          {skill.name}
                        </span>
                        <span style={{ color, fontSize: ".78rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, transition: "width 1s" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(skill)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110"
                        style={{ background: "rgba(34,211,238,.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,.2)" }}
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(239,68,68,.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,.2)" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {(grouped[value] || []).length === 0 && (
                  <p style={{ color: "#64748b", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", textAlign: "center", padding: "12px 0" }}>
                    No skills yet
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <h2 className="text-xl font-black mb-5" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>
              {editing ? "Edit Skill" : "Add New Skill"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Skill Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Python" />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Skill["category"] }))}
                >
                  {CATEGORIES.map(({ value, label }) => (
                    <option key={value} value={value} style={{ background: "#071428" }}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Proficiency Level: {form.level}%</label>
                <input
                  type="range" min={10} max={100} step={5}
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: +e.target.value }))}
                  style={{ width: "100%", accentColor: "#22d3ee", height: "6px" }}
                />
                <div className="progress-track mt-2">
                  <div className="progress-fill-cyan" style={{ width: `${form.level}%` }} />
                </div>
              </div>
              <div>
                <label className="form-label">Display Order</label>
                <input type="number" className="form-input" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: +e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Save size={16} />
                {saving ? "Saving..." : "Save Skill"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
