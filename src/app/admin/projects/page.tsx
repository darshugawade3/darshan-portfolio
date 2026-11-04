"use client";
// src/app/admin/projects/page.tsx — FIXED: removed all "as any", proper types
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, Upload, Eye, X } from "lucide-react";
import { projectsService } from "@/lib/db";
import { uploadFile, storagePaths } from "@/lib/storage";
import { useProjects } from "@/hooks/usePortfolioData";
import type { Project, ProjectFile } from "@/types";

type ProjectColor  = Project["color"];
type ProjectStatus = Project["status"];

interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  color: ProjectColor;
  icon: string;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  objectives: string[];
  methodology: string;
  results: string;
  futureScope: string;
  technologies: string[];
  images: ProjectFile[];
  pdfReport?: ProjectFile;
  pptFile?: ProjectFile;
  videoURL: string;
  githubURL: string;
  liveURL: string;
}

const EMPTY_FORM: ProjectFormData = {
  title: "", subtitle: "", description: "", longDescription: "",
  tags: [], color: "cyan", icon: "🔬", featured: false, order: 0,
  status: "completed", startDate: "", endDate: "",
  objectives: [], methodology: "", results: "", futureScope: "",
  technologies: [], images: [],
  videoURL: "", githubURL: "", liveURL: "",
};

export default function ProjectsAdminPage() {
  const { projects, loading, refresh } = useProjects();
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Project | null>(null);
  const [form, setForm]             = useState<ProjectFormData>({ ...EMPTY_FORM });
  const [saving, setSaving]         = useState(false);
  const [uploadingFile, setUploadingFile] = useState<"image" | "pdf" | "ppt" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagsInput, setTagsInput]   = useState("");
  const [objInput, setObjInput]     = useState("");

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: projects.length });
    setTagsInput(""); setObjInput("");
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,       subtitle: p.subtitle,
      description: p.description, longDescription: p.longDescription,
      tags: p.tags,         color: p.color,
      icon: p.icon,         featured: p.featured,
      order: p.order,       status: p.status,
      startDate: p.startDate, endDate: p.endDate ?? "",
      objectives: p.objectives, methodology: p.methodology,
      results: p.results,   futureScope: p.futureScope,
      technologies: p.technologies, images: p.images ?? [],
      pdfReport: p.pdfReport, pptFile: p.pptFile,
      videoURL: p.videoURL ?? "", githubURL: p.githubURL ?? "",
      liveURL: p.liveURL ?? "",
    });
    setTagsInput(p.tags.join(", "));
    setObjInput(p.objectives.join("\n"));
    setShowModal(true);
  };

  const handleFileUpload = useCallback(async (
    file: File,
    type: "image" | "pdf" | "ppt"
  ) => {
    const projectId = editing?.id ?? `new_${Date.now()}`;
    setUploadingFile(type);
    setUploadProgress(0);
    try {
      const url = await uploadFile(
        storagePaths.project(projectId, `${Date.now()}_${file.name}`),
        file,
        setUploadProgress
      );
      const fileObj: ProjectFile = {
        url, name: file.name, type: file.type,
        size: file.size, uploadedAt: new Date().toISOString(),
      };
      if (type === "image") {
        setForm((f) => ({ ...f, images: [...f.images, fileObj] }));
      } else if (type === "pdf") {
        setForm((f) => ({ ...f, pdfReport: fileObj }));
      } else {
        setForm((f) => ({ ...f, pptFile: fileObj }));
      }
      toast.success(`${file.name} uploaded!`);
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploadingFile(null);
      setUploadProgress(0);
    }
  }, [editing?.id]);

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const objectives = objInput.split("\n").map((o) => o.trim()).filter(Boolean);

      const payload: Omit<Project, "id"> = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        longDescription: form.longDescription,
        tags,
        color: form.color,
        icon: form.icon,
        featured: form.featured,
        order: form.order,
        status: form.status,
        startDate: form.startDate,
        ...(form.endDate ? { endDate: form.endDate } : {}),
        objectives,
        methodology: form.methodology,
        results: form.results,
        futureScope: form.futureScope,
        technologies: form.technologies,
        images: form.images,
        ...(form.pdfReport ? { pdfReport: form.pdfReport } : {}),
        ...(form.pptFile   ? { pptFile:   form.pptFile   } : {}),
        ...(form.videoURL  ? { videoURL:  form.videoURL  } : {}),
        ...(form.githubURL ? { githubURL: form.githubURL } : {}),
        ...(form.liveURL   ? { liveURL:   form.liveURL   } : {}),
        viewCount: editing?.viewCount ?? 0,
        createdAt: editing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editing) {
        await projectsService.update(editing.id, payload);
        toast.success("Project updated!");
      } else {
        await projectsService.add(payload);
        toast.success("Project added!");
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
    if (!confirm(`Delete project "${title}"?`)) return;
    try {
      await projectsService.delete(id);
      await refresh();
      toast.success("Project deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div style={{ maxWidth: "960px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "4px" }}>
            Projects
          </h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass" style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📂</div>
          <h3 style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontWeight: 800, marginBottom: "8px" }}>
            No Projects Yet
          </h3>
          <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
            Click &quot;Add Project&quot; to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map((p) => (
            <div key={p.id} className="glass" style={{ padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", flexShrink: 0,
                  background: p.color === "cyan" ? "rgba(34,211,238,.1)" : p.color === "gold" ? "rgba(251,191,36,.1)" : p.color === "purple" ? "rgba(167,139,250,.1)" : "rgba(52,211,153,.1)",
                  border: `1px solid ${p.color === "cyan" ? "rgba(34,211,238,.2)" : p.color === "gold" ? "rgba(251,191,36,.2)" : p.color === "purple" ? "rgba(167,139,250,.2)" : "rgba(52,211,153,.2)"}`,
                }}
              >
                {p.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                  <h3 style={{ color: "#f8fafc", fontWeight: 800, fontFamily: "Exo 2, sans-serif", fontSize: ".9rem" }}>
                    {p.title}
                  </h3>
                  {p.featured && <span className="tag-cyan" style={{ fontSize: ".65rem" }}>Featured</span>}
                  <span className={`status-${p.status}`}>{p.status}</span>
                </div>
                <p style={{ color: "#64748b", fontSize: ".82rem", fontFamily: "Exo 2, sans-serif", marginBottom: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t} className="tag-cyan" style={{ fontSize: ".66rem" }}>{t}</span>
                  ))}
                  {p.tags.length > 4 && (
                    <span style={{ color: "#64748b", fontSize: ".72rem" }}>+{p.tags.length - 4} more</span>
                  )}
                  <span style={{ color: "#64748b", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Eye size={11} /> {p.viewCount ?? 0}
                  </span>
                  {(p.images?.length ?? 0) > 0 && <span style={{ color: "#64748b", fontSize: ".72rem" }}>🖼 {p.images.length}</span>}
                  {p.pdfReport && <span style={{ color: "#64748b", fontSize: ".72rem" }}>📄 PDF</span>}
                  {p.pptFile   && <span style={{ color: "#64748b", fontSize: ".72rem" }}>📑 PPT</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => openEdit(p)} className="btn-secondary" style={{ padding: "7px 14px", fontSize: ".8rem" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id, p.title)} className="btn-danger" style={{ padding: "7px 10px" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: "820px" }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>
                {editing ? "Edit Project" : "Add New Project"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Scrollable form */}
            <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "4px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">Project Title *</label>
                  <input className="form-input" value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Project Title" />
                </div>
                <div>
                  <label className="form-label">Subtitle</label>
                  <input className="form-input" value={form.subtitle}
                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    placeholder="Short subtitle" />
                </div>
              </div>

              {/* Short desc */}
              <div>
                <label className="form-label">Short Description</label>
                <textarea rows={2} className="form-input" value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief overview..." style={{ resize: "vertical" }} />
              </div>

              {/* Long desc */}
              <div>
                <label className="form-label">Detailed Description</label>
                <textarea rows={4} className="form-input" value={form.longDescription}
                  onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                  placeholder="Full project description..." style={{ resize: "vertical" }} />
              </div>

              {/* Row: icon / color / status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">Icon (Emoji)</label>
                  <input className="form-input" value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    placeholder="🔬" />
                </div>
                <div>
                  <label className="form-label">Color Theme</label>
                  <select className="form-input" value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value as ProjectColor }))}>
                    {(["cyan", "gold", "purple", "green"] as ProjectColor[]).map((c) => (
                      <option key={c} value={c} style={{ background: "#071428" }}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))}>
                    {(["completed", "ongoing", "planned"] as ProjectStatus[]).map((s) => (
                      <option key={s} value={s} style={{ background: "#071428" }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Python, Power BI, Healthcare, ..." />
              </div>

              {/* Objectives */}
              <div>
                <label className="form-label">Objectives (one per line)</label>
                <textarea rows={4} className="form-input" value={objInput}
                  onChange={(e) => setObjInput(e.target.value)}
                  placeholder={"Objective 1\nObjective 2\n..."} style={{ resize: "vertical" }} />
              </div>

              {/* Methodology / Results */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">Methodology</label>
                  <textarea rows={3} className="form-input" value={form.methodology}
                    onChange={(e) => setForm((f) => ({ ...f, methodology: e.target.value }))}
                    style={{ resize: "vertical" }} />
                </div>
                <div>
                  <label className="form-label">Results</label>
                  <textarea rows={3} className="form-input" value={form.results}
                    onChange={(e) => setForm((f) => ({ ...f, results: e.target.value }))}
                    style={{ resize: "vertical" }} />
                </div>
              </div>

              {/* Future scope */}
              <div>
                <label className="form-label">Future Scope</label>
                <textarea rows={2} className="form-input" value={form.futureScope}
                  onChange={(e) => setForm((f) => ({ ...f, futureScope: e.target.value }))}
                  style={{ resize: "vertical" }} />
              </div>

              {/* Links */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">GitHub URL</label>
                  <input className="form-input" value={form.githubURL}
                    onChange={(e) => setForm((f) => ({ ...f, githubURL: e.target.value }))}
                    placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="form-label">Live / Demo URL</label>
                  <input className="form-input" value={form.liveURL}
                    onChange={(e) => setForm((f) => ({ ...f, liveURL: e.target.value }))}
                    placeholder="https://..." />
                </div>
              </div>

              {/* File uploads */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {/* Images */}
                <div>
                  <label className="form-label">Project Images</label>
                  <label className="upload-zone" style={{ padding: "14px", cursor: "pointer", display: "block", textAlign: "center" }}>
                    <input type="file" accept="image/*" multiple style={{ display: "none" }}
                      onChange={(e) => Array.from(e.target.files ?? []).forEach((f) => handleFileUpload(f, "image"))} />
                    {uploadingFile === "image" ? (
                      <div>
                        <div className="progress-track" style={{ marginBottom: "4px" }}>
                          <div className="progress-fill-cyan" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontSize: ".75rem" }}>{uploadProgress}%</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} style={{ color: "#22d3ee", margin: "0 auto 5px" }} />
                        <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                          {form.images.length > 0 ? `${form.images.length} uploaded` : "Upload Images"}
                        </p>
                      </div>
                    )}
                  </label>
                  {/* Thumbnails */}
                  {form.images.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "6px" }}>
                      {form.images.map((img, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img src={img.url} alt={img.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px", border: "1px solid rgba(34,211,238,.2)" }} />
                          <button onClick={() => removeImage(idx)}
                            style={{ position: "absolute", top: "-4px", right: "-4px", width: "14px", height: "14px", borderRadius: "50%", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDF */}
                <div>
                  <label className="form-label">PDF Report</label>
                  <label className="upload-zone" style={{ padding: "14px", cursor: "pointer", display: "block", textAlign: "center" }}>
                    <input type="file" accept=".pdf" style={{ display: "none" }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "pdf"); }} />
                    {uploadingFile === "pdf" ? (
                      <div>
                        <div className="progress-track" style={{ marginBottom: "4px" }}>
                          <div className="progress-fill-cyan" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontSize: ".75rem" }}>{uploadProgress}%</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} style={{ color: form.pdfReport ? "#22d3ee" : "#64748b", margin: "0 auto 5px" }} />
                        <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                          {form.pdfReport ? `✓ ${form.pdfReport.name}` : "Upload PDF"}
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {/* PPT */}
                <div>
                  <label className="form-label">Presentation (PPT)</label>
                  <label className="upload-zone" style={{ padding: "14px", cursor: "pointer", display: "block", textAlign: "center" }}>
                    <input type="file" accept=".ppt,.pptx" style={{ display: "none" }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "ppt"); }} />
                    {uploadingFile === "ppt" ? (
                      <div>
                        <div className="progress-track" style={{ marginBottom: "4px" }}>
                          <div className="progress-fill-gold" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p style={{ color: "#fbbf24", fontFamily: "Exo 2, sans-serif", fontSize: ".75rem" }}>{uploadProgress}%</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} style={{ color: form.pptFile ? "#fbbf24" : "#64748b", margin: "0 auto 5px" }} />
                        <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>
                          {form.pptFile ? `✓ ${form.pptFile.name}` : "Upload PPT"}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Featured */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="checkbox" id="featuredCheck" checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  style={{ accentColor: "#22d3ee" }} />
                <label htmlFor="featuredCheck"
                  style={{ color: "#94a3b8", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", cursor: "pointer" }}>
                  Mark as Featured Project
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ display: "flex", gap: "10px", marginTop: "18px", paddingTop: "16px", borderTop: "1px solid rgba(34,211,238,.1)" }}>
              <button onClick={handleSave} disabled={saving} className="btn-primary"
                style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                <Save size={16} />
                {saving ? "Saving..." : "Save Project"}
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
