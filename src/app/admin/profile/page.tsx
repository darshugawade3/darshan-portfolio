"use client";
// src/app/admin/profile/page.tsx — FIXED: proper optional field handling, no type errors
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Save, User, Eye, Download } from "lucide-react";
import { profileService } from "@/lib/db";
import { uploadFile, storagePaths } from "@/lib/storage";
import type { Profile } from "@/types";

type ProfileDraft = {
  name: string;
  title: string;
  bio: string;
  about: string;
  objective: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  photoURL: string;
  resumeURL: string;
  resumeName: string;
  visitorCount: number;
  downloadCount: number;
};

const DEFAULT_DRAFT: ProfileDraft = {
  name: "", title: "", bio: "", about: "", objective: "",
  email: "", phone: "", location: "",
  linkedin: "", github: "", twitter: "", website: "",
  photoURL: "", resumeURL: "", resumeName: "",
  visitorCount: 0, downloadCount: 0,
};

function toProfileDraft(p: Profile): ProfileDraft {
  return {
    name: p.name ?? "",
    title: p.title ?? "",
    bio: p.bio ?? "",
    about: p.about ?? "",
    objective: p.objective ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    location: p.location ?? "",
    linkedin: p.linkedin ?? "",
    github: p.github ?? "",
    twitter: p.twitter ?? "",
    website: p.website ?? "",
    photoURL: p.photoURL ?? "",
    resumeURL: p.resumeURL ?? "",
    resumeName: p.resumeName ?? "",
    visitorCount: p.visitorCount ?? 0,
    downloadCount: p.downloadCount ?? 0,
  };
}

export default function ProfileAdminPage() {
  const [draft, setDraft]           = useState<ProfileDraft>({ ...DEFAULT_DRAFT });
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    profileService.get().then((p) => {
      if (p) setDraft(toProfileDraft(p));
      setPageLoading(false);
    });
  }, []);

  const onDropPhoto = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      setUploadProgress(0);
      try {
        const url = await uploadFile(
          storagePaths.profile(),
          file,
          setUploadProgress
        );
        setDraft((d) => ({ ...d, photoURL: url }));
        toast.success("Photo uploaded successfully!");
      } catch {
        toast.error("Photo upload failed.");
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropPhoto,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleSave = async () => {
    if (!draft.name.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    try {
      const payload: Partial<Profile> = {
        name: draft.name,
        title: draft.title,
        bio: draft.bio,
        about: draft.about,
        objective: draft.objective,
        email: draft.email,
        phone: draft.phone,
        location: draft.location,
        linkedin: draft.linkedin,
        github: draft.github,
        twitter: draft.twitter,
        website: draft.website,
        photoURL: draft.photoURL,
        resumeURL: draft.resumeURL,
        resumeName: draft.resumeName,
      };
      await profileService.set(payload);
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof ProfileDraft,
    opts: { type?: string; rows?: number; placeholder?: string } = {}
  ) => (
    <div>
      <label className="form-label">{label}</label>
      {opts.rows ? (
        <textarea
          rows={opts.rows}
          className="form-input"
          value={draft[key] as string}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          placeholder={opts.placeholder ?? ""}
          style={{ resize: "vertical" }}
        />
      ) : (
        <input
          type={opts.type ?? "text"}
          className="form-input"
          value={draft[key] as string}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          placeholder={opts.placeholder ?? ""}
        />
      )}
    </div>
  );

  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "4px" }}>
            Profile Management
          </h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
            Changes appear instantly on your live portfolio.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px", alignItems: "start" }}>
        {/* Left: Photo + Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Photo upload */}
          <div className="glass" style={{ padding: "18px" }}>
            <h3 style={{ color: "#22d3ee", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".85rem", marginBottom: "12px" }}>
              Profile Photo
            </h3>
            <div
              {...getRootProps()}
              className={`upload-zone ${isDragActive ? "drag-over" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps()} />
              {draft.photoURL ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={draft.photoURL}
                    alt="Profile"
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 8px", border: "3px solid rgba(34,211,238,.4)", display: "block" }}
                  />
                  <p style={{ color: "#64748b", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>
                    {isDragActive ? "Drop here!" : "Click to replace"}
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <User size={24} style={{ color: "#22d3ee" }} />
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif" }}>
                    {isDragActive ? "Drop photo here!" : "Click or drag photo"}
                  </p>
                  <p style={{ color: "#64748b", fontSize: ".7rem", marginTop: "3px", fontFamily: "Exo 2, sans-serif" }}>
                    JPG, PNG, WEBP
                  </p>
                </div>
              )}
              {uploading && (
                <div style={{ marginTop: "10px" }}>
                  <div className="progress-track">
                    <div className="progress-fill-cyan" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p style={{ color: "#22d3ee", fontSize: ".72rem", marginTop: "4px", fontFamily: "Exo 2, sans-serif", textAlign: "center" }}>
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="glass" style={{ padding: "16px" }}>
            <h3 style={{ color: "#fbbf24", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".85rem", marginBottom: "12px" }}>
              Site Statistics
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: ".82rem", fontFamily: "Exo 2, sans-serif" }}>
                <Eye size={13} /> Visitors
              </div>
              <span style={{ color: "#22d3ee", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
                {draft.visitorCount.toLocaleString()}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: ".82rem", fontFamily: "Exo 2, sans-serif" }}>
                <Download size={13} /> Downloads
              </div>
              <span style={{ color: "#fbbf24", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
                {draft.downloadCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: All fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Basic */}
          <div className="glass" style={{ padding: "20px" }}>
            <h3 style={{ color: "#22d3ee", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".875rem", marginBottom: "14px" }}>
              Basic Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {field("Full Name *", "name", { placeholder: "Darshan Suresh Gawade" })}
              {field("Professional Title", "title", { placeholder: "B.Pharm Student | ..." })}
            </div>
            <div style={{ marginTop: "12px" }}>
              {field("Short Bio (Hero section tagline)", "bio", { rows: 2, placeholder: "Pharmaceutical Research | Healthcare Analytics | Data Science" })}
            </div>
            <div style={{ marginTop: "12px" }}>
              {field("About Me (Full description)", "about", { rows: 4, placeholder: "Detailed professional summary..." })}
            </div>
            <div style={{ marginTop: "12px" }}>
              {field("Career Objective", "objective", { rows: 3, placeholder: "Your career goals and aspirations..." })}
            </div>
          </div>

          {/* Contact */}
          <div className="glass" style={{ padding: "20px" }}>
            <h3 style={{ color: "#fbbf24", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".875rem", marginBottom: "14px" }}>
              Contact Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {field("Email", "email", { type: "email", placeholder: "darshhugawade3@gmail.com" })}
              {field("Phone", "phone", { placeholder: "8956875201" })}
              {field("Location / City", "location", { placeholder: "Dhule, Maharashtra, India" })}
            </div>
          </div>

          {/* Social */}
          <div className="glass" style={{ padding: "20px" }}>
            <h3 style={{ color: "#a78bfa", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".875rem", marginBottom: "14px" }}>
              Social Links
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {field("LinkedIn URL", "linkedin", { placeholder: "https://linkedin.com/in/..." })}
              {field("GitHub URL", "github", { placeholder: "https://github.com/..." })}
              {field("Twitter / X URL", "twitter", { placeholder: "https://twitter.com/..." })}
              {field("Website / Portfolio URL", "website", { placeholder: "https://..." })}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary"
            style={{ justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
            <Save size={16} />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
