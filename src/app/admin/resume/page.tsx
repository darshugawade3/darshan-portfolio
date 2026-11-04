"use client";
// src/app/admin/resume/page.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, Download, FileText, Trash2 } from "lucide-react";
import { profileService } from "@/lib/db";
import { uploadFile, storagePaths, deleteFile } from "@/lib/storage";

export default function ResumeAdminPage() {
  const [resumeURL, setResumeURL] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.get().then((p) => {
      if (p) { setResumeURL(p.resumeURL || ""); setResumeName(p.resumeName || ""); }
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
      toast.error("Only PDF or DOCX files are allowed."); return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(storagePaths.resume(file.name), file, setProgress);
      await profileService.set({ resumeURL: url, resumeName: file.name });
      setResumeURL(url); setResumeName(file.name);
      toast.success("Resume uploaded successfully!");
    } catch { toast.error("Upload failed."); }
    finally { setUploading(false); setProgress(0); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete current resume?")) return;
    try {
      if (resumeURL) await deleteFile(resumeURL);
      await profileService.set({ resumeURL: "", resumeName: "" });
      setResumeURL(""); setResumeName("");
      toast.success("Resume removed.");
    } catch { toast.error("Delete failed."); }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1" style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}>Resume Management</h1>
        <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>Upload your resume — visitors can download it from the portfolio.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="glass p-8">
          {resumeURL ? (
            <div>
              <div className="flex items-center gap-4 p-5 rounded-xl mb-6" style={{ background: "rgba(34,211,238,.05)", border: "1px solid rgba(34,211,238,.2)" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,.1)", border: "1px solid rgba(34,211,238,.2)" }}>
                  <FileText size={28} style={{ color: "#22d3ee" }} />
                </div>
                <div className="flex-1">
                  <div style={{ color: "#f8fafc", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>{resumeName}</div>
                  <div style={{ color: "#64748b", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif" }}>Currently active resume</div>
                </div>
                <div className="flex gap-2">
                  <a href={resumeURL} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "8px 14px", fontSize: ".82rem" }}>
                    <Download size={14} />Preview
                  </a>
                  <button onClick={handleDelete} className="btn-danger" style={{ padding: "8px 14px" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem", marginBottom: "12px" }}>Replace Resume</h3>
            </div>
          ) : (
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.2)" }}>
                <FileText size={36} style={{ color: "#fbbf24" }} />
              </div>
              <h3 style={{ color: "#f8fafc", fontWeight: 700, fontFamily: "Exo 2, sans-serif", marginBottom: "6px" }}>No Resume Uploaded</h3>
              <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>Upload your resume so visitors can download it.</p>
            </div>
          )}

          <label className="upload-zone cursor-pointer block">
            <input type="file" accept=".pdf,.docx,application/pdf" onChange={handleUpload} style={{ display: "none" }} />
            {uploading ? (
              <div>
                <div className="progress-track mb-2">
                  <div className="progress-fill-cyan" style={{ width: `${progress}%` }} />
                </div>
                <p style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>Uploading... {progress}%</p>
              </div>
            ) : (
              <div>
                <Upload size={28} style={{ color: "#22d3ee", margin: "0 auto 10px" }} />
                <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".9rem" }}>Click to upload resume</p>
                <p style={{ color: "#64748b", fontSize: ".75rem", marginTop: "4px", fontFamily: "Exo 2, sans-serif" }}>PDF or DOCX — max 10MB</p>
              </div>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
