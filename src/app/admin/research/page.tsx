"use client";
// src/app/admin/research/page.tsx — FIXED: journal/conference in EMPTY, proper form type
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, X, BookOpen, Upload } from "lucide-react";
import { researchService } from "@/lib/db";
import { uploadFile, storagePaths } from "@/lib/storage";
import { useResearch } from "@/hooks/usePortfolioData";
import type { ResearchWork } from "@/types";

const TYPES: ResearchWork["type"][] = ["paper", "poster", "presentation", "report", "publication"];

// Complete EMPTY object matching the ResearchWork type
const EMPTY: Omit<ResearchWork, "id"> = {
  title: "",
  abstract: "",
  authors: [],
  type: "report",
  journal: "",
  conference: "",
  year: "",
  fileURL: "",
  fileName: "",
  fileType: "",
  pptURL: "",
  doi: "",
  tags: [],
  featured: false,
  order: 0,
  createdAt: new Date().toISOString(),
};

export default function ResearchAdminPage() {
  const { research, loading, refresh } = useResearch();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ResearchWork | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"file" | "ppt" | null>(null);
  const [progress, setProgress] = useState(0);
  const [tagsInput, setTagsInput] = useState("");
  const [authorsInput, setAuthorsInput] = useState("");

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, order: research.length });
    setTagsInput("");
    setAuthorsInput("");
    setShowModal(true);
  };

  const openEdit = (r: ResearchWork) => {
    setEditing(r);
    setForm({
      title: r.title,
      abstract: r.abstract,
      authors: r.authors,
      type: r.type,
      journal: r.journal ?? "",
      conference: r.conference ?? "",
      year: r.year,
      fileURL: r.fileURL ?? "",
      fileName: r.fileName ?? "",
      fileType: r.fileType ?? "",
      pptURL: r.pptURL ?? "",
      doi: r.doi ?? "",
      tags: r.tags,
      featured: r.featured,
      order: r.order,
      createdAt: r.createdAt,
    });
    setTagsInput(r.tags.join(", "));
    setAuthorsInput(r.authors.join(", "));
    setShowModal(true);
  };

  const handleUpload = async (file: File, type: "file" | "ppt") => {
    const id = editing?.id ?? `res_${Date.now()}`;
    setUploading(type);
    setProgress(0);
    try {
      const url = await uploadFile(
        storagePaths.research(id, file.name),
        file,
        setProgress
      );
      if (type === "file") {
        setForm((f) => ({ ...f, fileURL: url, fileName: file.name, fileType: file.type }));
      } else {
        setForm((f) => ({ ...f, pptURL: url }));
      }
      toast.success(`${type === "file" ? "File" : "PPT"} uploaded!`);
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(null);
      setProgress(0);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    setSaving(true);
    try {
      const data: Omit<ResearchWork, "id"> = {
        ...form,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        authors: authorsInput.split(",").map((a) => a.trim()).filter(Boolean),
      };
      if (editing) {
        await researchService.update(editing.id, data);
        toast.success("Research work updated!");
      } else {
        await researchService.add(data);
        toast.success("Research work added!");
      }
      await refresh();
      setShowModal(false);
    } catch {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await researchService.delete(id);
      await refresh();
      toast.success("Deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const TYPE_ICONS: Record<ResearchWork["type"], string> = {
    paper: "📄", poster: "🖼", presentation: "📑", report: "📋", publication: "📰",
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "4px" }}>
            Research Portfolio
          </h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
            {research.length} work{research.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Add Research
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : research.length === 0 ? (
        <div className="glass" style={{ padding: "48px", textAlign: "center" }}>
          <BookOpen size={40} style={{ color: "#a78bfa", margin: "0 auto 10px", opacity: 0.5 }} />
          <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>
            No research works added yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {research.map((r) => (
            <div
              key={r.id}
              className="glass"
              style={{ padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: "14px" }}
            >
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)" }}>
                {TYPE_ICONS[r.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <h3 style={{ color: "#f8fafc", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".9rem" }}>
                    {r.title}
                  </h3>
                  {r.featured && <span className="tag-cyan" style={{ fontSize: ".65rem" }}>Featured</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span className="tag-purple" style={{ fontSize: ".68rem" }}>{r.type}</span>
                  <span style={{ color: "#64748b", fontSize: ".78rem", fontFamily: "Exo 2, sans-serif" }}>
                    {r.year}
                  </span>
                  {r.fileURL && (
                    <span style={{ color: "#22d3ee", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>
                      📎 File attached
                    </span>
                  )}
                  {r.pptURL && (
                    <span style={{ color: "#fbbf24", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>
                      📊 PPT attached
                    </span>
                  )}
                </div>
                {r.abstract && (
                  <p style={{ color: "#64748b", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.abstract}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => openEdit(r)} className="btn-secondary" style={{ padding: "7px 14px", fontSize: ".8rem" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(r.id, r.title)} className="btn-danger" style={{ padding: "7px 10px" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-box" style={{ maxWidth: "700px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>
                {editing ? "Edit Research Work" : "Add Research Work"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: "4px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Research title"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Type</label>
                    <select
                      className="form-input"
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type: e.target.value as ResearchWork["type"] }))
                      }
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t} style={{ background: "#071428" }}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Year</label>
                    <input
                      className="form-input"
                      value={form.year}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                      placeholder="2025"
                    />
                  </div>
                  <div>
                    <label className="form-label">DOI</label>
                    <input
                      className="form-input"
                      value={form.doi}
                      onChange={(e) => setForm((f) => ({ ...f, doi: e.target.value }))}
                      placeholder="10.xxxx/..."
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Journal</label>
                    <input
                      className="form-input"
                      value={form.journal}
                      onChange={(e) => setForm((f) => ({ ...f, journal: e.target.value }))}
                      placeholder="Journal name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Conference</label>
                    <input
                      className="form-input"
                      value={form.conference}
                      onChange={(e) => setForm((f) => ({ ...f, conference: e.target.value }))}
                      placeholder="Conference name"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Authors (comma-separated)</label>
                  <input
                    className="form-input"
                    value={authorsInput}
                    onChange={(e) => setAuthorsInput(e.target.value)}
                    placeholder="Darshan Gawade, Co-Author Name"
                  />
                </div>

                <div>
                  <label className="form-label">Abstract</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    value={form.abstract}
                    onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    className="form-input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Phytochemistry, Herbal Medicine, ..."
                  />
                </div>

                {/* File uploads */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Main File (PDF / DOCX / PPT)</label>
                    <label className="upload-zone" style={{ padding: "14px", cursor: "pointer", display: "block" }}>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.doc,.docx"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(f, "file");
                        }}
                      />
                      {uploading === "file" ? (
                        <div>
                          <div className="progress-track" style={{ marginBottom: "4px" }}>
                            <div className="progress-fill-cyan" style={{ width: `${progress}%` }} />
                          </div>
                          <p style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                            {progress}%
                          </p>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <Upload size={18} style={{ color: form.fileURL ? "#22d3ee" : "#64748b", margin: "0 auto 4px" }} />
                          <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                            {form.fileName ? `✓ ${form.fileName}` : "Upload file"}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  <div>
                    <label className="form-label">Presentation (PPT)</label>
                    <label className="upload-zone" style={{ padding: "14px", cursor: "pointer", display: "block" }}>
                      <input
                        type="file"
                        accept=".ppt,.pptx"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(f, "ppt");
                        }}
                      />
                      {uploading === "ppt" ? (
                        <div>
                          <div className="progress-track" style={{ marginBottom: "4px" }}>
                            <div className="progress-fill-gold" style={{ width: `${progress}%` }} />
                          </div>
                          <p style={{ color: "#fbbf24", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                            {progress}%
                          </p>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <Upload size={18} style={{ color: form.pptURL ? "#fbbf24" : "#64748b", margin: "0 auto 4px" }} />
                          <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                            {form.pptURL ? "✓ PPT uploaded" : "Upload PPT"}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="resFeat"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    style={{ accentColor: "#22d3ee" }}
                  />
                  <label
                    htmlFor="resFeat"
                    style={{ color: "#94a3b8", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", cursor: "pointer" }}
                  >
                    Feature this work
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "18px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(34,211,238,.1)",
              }}
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
