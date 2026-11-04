"use client";
// src/app/admin/education/page.tsx
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, X, GraduationCap } from "lucide-react";
import { educationService } from "@/lib/db";
import { useEducation } from "@/hooks/usePortfolioData";
import type { Education } from "@/types";

const EMPTY: Omit<Education, "id"> = {
  degree: "", field: "", institute: "", university: "",
  startYear: "", endYear: "", grade: "", achievements: [], order: 0, current: false,
};

export default function EducationAdminPage() {
  const { education, loading, refresh } = useEducation();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [achInput, setAchInput] = useState("");

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, order: education.length }); setAchInput(""); setShowModal(true); };
  const openEdit = (e: Education) => {
    setEditing(e);
    setForm({ degree: e.degree, field: e.field, institute: e.institute, university: e.university, startYear: e.startYear, endYear: e.endYear, grade: e.grade, achievements: e.achievements, order: e.order, current: e.current });
    setAchInput(e.achievements.join("\n"));
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.degree || !form.institute) { toast.error("Degree and institute required."); return; }
    setSaving(true);
    try {
      const data = { ...form, achievements: achInput.split("\n").map((a) => a.trim()).filter(Boolean) };
      if (editing) { await educationService.update(editing.id, data); toast.success("Updated!"); }
      else { await educationService.add(data); toast.success("Added!"); }
      await refresh(); setShowModal(false);
    } catch { toast.error("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, degree: string) => {
    if (!confirm(`Delete "${degree}"?`)) return;
    try { await educationService.delete(id); await refresh(); toast.success("Deleted."); }
    catch { toast.error("Failed."); }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>Education</h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>{education.length} entries</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} />Add Education</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : education.length === 0 ? (
        <div className="glass p-12 text-center">
          <GraduationCap size={40} style={{ color: "#22d3ee", margin: "0 auto 10px", opacity: .5 }} />
          <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>No education added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="glass p-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: edu.current ? "linear-gradient(135deg,#22d3ee,#0891b2)" : "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.2)" }}>
                <GraduationCap size={22} style={{ color: edu.current ? "#020817" : "#22d3ee" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 style={{ color: "#f8fafc", fontWeight: 800, fontFamily: "Exo 2, sans-serif" }}>{edu.degree}</h3>
                    {edu.field && <p style={{ color: "#22d3ee", fontSize: ".85rem", fontFamily: "Exo 2, sans-serif" }}>{edu.field}</p>}
                    <p style={{ color: "#94a3b8", fontSize: ".85rem", fontFamily: "Exo 2, sans-serif" }}>{edu.institute}</p>
                    <p style={{ color: "#64748b", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif" }}>{edu.university}</p>
                  </div>
                  <div className="text-right">
                    <span className="tag-cyan">{edu.startYear} – {edu.current ? "Present" : edu.endYear}</span>
                    {edu.grade && <p style={{ color: "#fbbf24", fontSize: ".8rem", fontWeight: 700, marginTop: "4px", fontFamily: "Exo 2, sans-serif" }}>{edu.grade}</p>}
                  </div>
                </div>
                {edu.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {edu.achievements.slice(0, 2).map((a, i) => (
                      <li key={i} style={{ color: "#64748b", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", display: "flex", gap: "6px" }}>
                        <span style={{ color: "#22d3ee" }}>▸</span>{a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(edu)} className="btn-secondary" style={{ padding: "7px 14px", fontSize: ".8rem" }}>Edit</button>
                <button onClick={() => handleDelete(edu.id, edu.degree)} className="btn-danger" style={{ padding: "7px 10px" }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-black" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>{editing ? "Edit" : "Add"} Education</h2>
              <button onClick={() => setShowModal(false)} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Degree / Qualification *</label>
                  <input className="form-input" value={form.degree} onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))} placeholder="e.g. B.Pharm" />
                </div>
                <div>
                  <label className="form-label">Field / Specialization</label>
                  <input className="form-input" value={form.field} onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))} placeholder="e.g. Pharmacy" />
                </div>
                <div>
                  <label className="form-label">Institute *</label>
                  <input className="form-input" value={form.institute} onChange={(e) => setForm((f) => ({ ...f, institute: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">University / Board</label>
                  <input className="form-input" value={form.university} onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Start Year</label>
                  <input className="form-input" value={form.startYear} onChange={(e) => setForm((f) => ({ ...f, startYear: e.target.value }))} placeholder="2022" />
                </div>
                <div>
                  <label className="form-label">End Year (or leave blank if current)</label>
                  <input className="form-input" value={form.endYear} onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value }))} placeholder="2026" />
                </div>
                <div>
                  <label className="form-label">Grade / CGPA / %</label>
                  <input className="form-input" value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} placeholder="e.g. 8.5 CGPA" />
                </div>
              </div>
              <div>
                <label className="form-label">Achievements (one per line)</label>
                <textarea rows={4} className="form-input" value={achInput} onChange={(e) => setAchInput(e.target.value)} style={{ resize: "vertical" }} placeholder="Achievement 1&#10;Achievement 2" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="current" checked={form.current} onChange={(e) => setForm((f) => ({ ...f, current: e.target.checked }))} className="accent-cyan-400" />
                <label htmlFor="current" style={{ color: "#94a3b8", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", cursor: "pointer" }}>Currently studying here</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center"><Save size={16} />{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
