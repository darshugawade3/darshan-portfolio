"use client";
// src/app/admin/certificates/page.tsx
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, X, Award, Upload } from "lucide-react";
import { certificatesService } from "@/lib/db";
import { uploadFile, storagePaths } from "@/lib/storage";
import { useCertificates } from "@/hooks/usePortfolioData";
import type { Certificate } from "@/types";

const EMPTY: Omit<Certificate, "id"> = {
  title: "", organization: "", date: "", credentialId: "",
  credentialURL: "", imageURL: "", pdfURL: "", category: "General",
  order: 0, featured: false, createdAt: new Date().toISOString(),
};

export default function CertificatesAdminPage() {
  const { certificates, loading, refresh } = useCertificates();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"image" | "pdf" | null>(null);
  const [progress, setProgress] = useState(0);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, order: certificates.length }); setShowModal(true); };
  const openEdit = (c: Certificate) => {
    setEditing(c);
    setForm({ title: c.title, organization: c.organization, date: c.date, credentialId: c.credentialId || "", credentialURL: c.credentialURL || "", imageURL: c.imageURL || "", pdfURL: c.pdfURL || "", category: c.category, order: c.order, featured: c.featured, createdAt: c.createdAt });
    setShowModal(true);
  };

  const handleFileUpload = async (file: File, type: "image" | "pdf") => {
    const id = editing?.id || `cert_${Date.now()}`;
    setUploading(type);
    try {
      const url = await uploadFile(storagePaths.certificate(id, file.name), file, setProgress);
      setForm((f) => ({ ...f, [type === "image" ? "imageURL" : "pdfURL"]: url }));
      toast.success(`${type === "image" ? "Image" : "PDF"} uploaded!`);
    } catch { toast.error("Upload failed."); }
    finally { setUploading(null); setProgress(0); }
  };

  const handleSave = async () => {
    if (!form.title || !form.organization) { toast.error("Title and organization are required."); return; }
    setSaving(true);
    try {
      if (editing) { await certificatesService.update(editing.id, form); toast.success("Certificate updated!"); }
      else { await certificatesService.add(form); toast.success("Certificate added!"); }
      await refresh(); setShowModal(false);
    } catch { toast.error("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { await certificatesService.delete(id); await refresh(); toast.success("Deleted."); }
    catch { toast.error("Delete failed."); }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>Certificates</h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>{certificates.length} certificate{certificates.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} />Add Certificate</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : certificates.length === 0 ? (
        <div className="glass p-12 text-center">
          <Award size={40} style={{ color: "#fbbf24", margin: "0 auto 10px", opacity: .6 }} />
          <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>No certificates yet. Click "Add Certificate".</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="glass p-4 hover:scale-[1.01] transition-transform">
              <div className="aspect-video rounded-xl mb-3 overflow-hidden flex items-center justify-center"
                style={{ background: "rgba(251,191,36,.05)", border: "1px solid rgba(251,191,36,.15)" }}>
                {cert.imageURL ? (
                  <img src={cert.imageURL} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  <Award size={36} style={{ color: "#fbbf24", opacity: .5 }} />
                )}
              </div>
              <h3 style={{ color: "#f8fafc", fontWeight: 700, fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", marginBottom: "4px" }}>{cert.title}</h3>
              <p style={{ color: "#22d3ee", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif" }}>{cert.organization}</p>
              <p style={{ color: "#64748b", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif", marginTop: "2px" }}>{cert.date}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(cert)} className="btn-secondary flex-1 justify-center" style={{ padding: "7px", fontSize: ".78rem" }}>Edit</button>
                <button onClick={() => handleDelete(cert.id, cert.title)} className="btn-danger" style={{ padding: "7px 10px" }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-black" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>
                {editing ? "Edit Certificate" : "Add Certificate"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Certificate Title *</label>
                  <input className="form-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Certificate Name" />
                </div>
                <div>
                  <label className="form-label">Issuing Organization *</label>
                  <input className="form-input" value={form.organization} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} placeholder="e.g. Coursera" />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input type="month" className="form-input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <input className="form-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Data Science" />
                </div>
                <div>
                  <label className="form-label">Credential ID</label>
                  <input className="form-input" value={form.credentialId} onChange={(e) => setForm((f) => ({ ...f, credentialId: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Credential URL</label>
                  <input className="form-input" value={form.credentialURL} onChange={(e) => setForm((f) => ({ ...f, credentialURL: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              {/* File uploads */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Certificate Image</label>
                  <label className="upload-zone cursor-pointer block" style={{ padding: "16px" }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "image"); }} />
                    {uploading === "image" ? (
                      <div><div className="progress-track mb-1"><div className="progress-fill-cyan" style={{ width: `${progress}%` }} /></div><p style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontSize: ".8rem" }}>{progress}%</p></div>
                    ) : (
                      <div>
                        {form.imageURL ? <img src={form.imageURL} alt="" className="w-16 h-16 rounded-lg mx-auto mb-2 object-cover" /> : <Upload size={20} style={{ color: "#22d3ee", margin: "0 auto 6px" }} />}
                        <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>{form.imageURL ? "Change Image" : "Upload Image"}</p>
                      </div>
                    )}
                  </label>
                </div>
                <div>
                  <label className="form-label">Certificate PDF</label>
                  <label className="upload-zone cursor-pointer block" style={{ padding: "16px" }}>
                    <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "pdf"); }} />
                    {uploading === "pdf" ? (
                      <div><div className="progress-track mb-1"><div className="progress-fill-gold" style={{ width: `${progress}%` }} /></div><p style={{ color: "#fbbf24", fontFamily: "Exo 2, sans-serif", fontSize: ".8rem" }}>{progress}%</p></div>
                    ) : (
                      <div>
                        <Upload size={20} style={{ color: form.pdfURL ? "#fbbf24" : "#22d3ee", margin: "0 auto 6px" }} />
                        <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".78rem" }}>{form.pdfURL ? "✓ PDF Uploaded" : "Upload PDF"}</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="certFeatured" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-cyan-400" />
                <label htmlFor="certFeatured" style={{ color: "#94a3b8", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", cursor: "pointer" }}>Feature this certificate</label>
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
