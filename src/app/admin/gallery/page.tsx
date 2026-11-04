"use client";
// src/app/admin/gallery/page.tsx — FIXED: stable refresh ref, no infinite render loops
import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, X, FolderPlus, ImageIcon } from "lucide-react";
import { galleryService } from "@/lib/db";
import { uploadFile, storagePaths } from "@/lib/storage";
import type { GalleryImage, GalleryAlbum } from "@/types";

// Load data directly (not via hook) so we have stable refresh control
async function loadGalleryData() {
  const [images, albums] = await Promise.all([
    galleryService.getImages(),
    galleryService.getAlbums(),
  ]);
  return { images, albums };
}

export default function GalleryAdminPage() {
  const [images, setImages]   = useState<GalleryImage[]>([]);
  const [albums, setAlbums]   = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum]   = useState("all");
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const data = await loadGalleryData();
    setImages(data.images);
    setAlbums(data.albums);
  }, []);

  useEffect(() => {
    loadGalleryData().then((data) => {
      setImages(data.images);
      setAlbums(data.albums);
      setLoading(false);
    });
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) { toast.error("Please select image files only."); return; }

    const currentAlbums = await galleryService.getAlbums();
    if (currentAlbums.length === 0) {
      toast.error("Create an album first before uploading images.");
      return;
    }
    const albumId = activeAlbum === "all" ? currentAlbums[0].id : activeAlbum;

    setUploading(true);
    let uploaded = 0;
    for (const file of imageFiles) {
      try {
        const url = await uploadFile(
          storagePaths.gallery(albumId, `${Date.now()}_${file.name}`),
          file,
          (p) => setUploadProgress(Math.round((uploaded * 100 + p) / imageFiles.length))
        );
        await galleryService.addImage({
          url,
          caption: file.name.replace(/\.[^.]+$/, ""),
          album: albumId,
          category: "general",
          order: images.length + uploaded,
          uploadedAt: new Date().toISOString(),
        });
        uploaded++;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    await refresh();
    toast.success(`${uploaded} image${uploaded !== 1 ? "s" : ""} uploaded!`);
    setUploading(false);
    setUploadProgress(0);
  }, [activeAlbum, images.length, refresh]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) uploadFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFiles(files);
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) { toast.error("Album name is required."); return; }
    try {
      await galleryService.addAlbum({
        name: newAlbumName.trim(),
        count: 0,
        createdAt: new Date().toISOString(),
      });
      await refresh();
      setNewAlbumName("");
      setShowAlbumModal(false);
      toast.success("Album created!");
    } catch {
      toast.error("Failed to create album.");
    }
  };

  const handleDeleteImage = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    try {
      await galleryService.deleteImage(img.id);
      await refresh();
      if (lightbox?.id === img.id) setLightbox(null);
      toast.success("Image deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleDeleteAlbum = async (albumId: string, name: string) => {
    if (!confirm(`Delete album "${name}" and all its images?`)) return;
    try {
      await galleryService.deleteAlbum(albumId);
      await refresh();
      if (activeAlbum === albumId) setActiveAlbum("all");
      toast.success("Album deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const filteredImages =
    activeAlbum === "all" ? images : images.filter((i) => i.album === activeAlbum);

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "4px" }}>
            Gallery
          </h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
            {images.length} images · {albums.length} albums
          </p>
        </div>
        <button onClick={() => setShowAlbumModal(true)} className="btn-secondary">
          <FolderPlus size={16} /> New Album
        </button>
      </div>

      {/* Album filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
        <button
          onClick={() => setActiveAlbum("all")}
          style={{
            padding: "5px 16px", borderRadius: "50px", border: "none", cursor: "pointer",
            fontFamily: "Exo 2, sans-serif", fontSize: ".8rem", fontWeight: 700, transition: "all .3s",
            background: activeAlbum === "all" ? "linear-gradient(135deg,#22d3ee,#0891b2)" : "rgba(34,211,238,.07)",
            color: activeAlbum === "all" ? "#020817" : "#94a3b8",
          }}
        >
          All ({images.length})
        </button>
        {albums.map((album) => {
          const albumImageCount = images.filter((i) => i.album === album.id).length;
          return (
            <div key={album.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setActiveAlbum(album.id)}
                style={{
                  padding: "5px 16px", borderRadius: "50px", cursor: "pointer",
                  fontFamily: "Exo 2, sans-serif", fontSize: ".8rem", fontWeight: 700, transition: "all .3s",
                  background: activeAlbum === album.id ? "linear-gradient(135deg,#22d3ee,#0891b2)" : "rgba(34,211,238,.07)",
                  color: activeAlbum === album.id ? "#020817" : "#94a3b8",
                  border: activeAlbum === album.id ? "none" : "1px solid rgba(34,211,238,.18)",
                }}
              >
                {album.name} ({albumImageCount})
              </button>
              <button
                onClick={() => handleDeleteAlbum(album.id, album.name)}
                style={{ width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,.15)", color: "#ef4444", border: "none", cursor: "pointer", fontSize: "10px" }}
              >
                <X size={9} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Drop zone */}
      <div
        ref={dropRef}
        className={`upload-zone ${isDragging ? "drag-over" : ""}`}
        style={{ marginBottom: "20px", position: "relative" }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("gal-file-input")?.click()}
      >
        <input
          id="gal-file-input"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileInput}
        />
        {uploading ? (
          <div>
            <div className="progress-track" style={{ maxWidth: "300px", margin: "0 auto 8px" }}>
              <div className="progress-fill-cyan" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : (
          <div>
            <ImageIcon size={28} style={{ color: "#22d3ee", margin: "0 auto 10px" }} />
            <p style={{ color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".9rem" }}>
              {isDragging ? "Drop images here!" : "Drag & drop images, or click to select"}
            </p>
            <p style={{ color: "#64748b", fontSize: ".75rem", marginTop: "4px", fontFamily: "Exo 2, sans-serif" }}>
              JPG, PNG, WEBP, GIF · Multiple files supported
            </p>
          </div>
        )}
      </div>

      {/* Images grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="glass" style={{ padding: "48px", textAlign: "center" }}>
          <ImageIcon size={40} style={{ color: "#64748b", margin: "0 auto 10px", opacity: 0.4 }} />
          <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>
            No images yet. Drag &amp; drop above to upload!
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "10px" }}>
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group"
              style={{ position: "relative", aspectRatio: "1", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(34,211,238,.12)" }}
            >
              <img
                src={img.url}
                alt={img.caption}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
              {/* Hover overlay */}
              <div
                style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,.72)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px",
                  opacity: 0, transition: "opacity .25s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <button
                  onClick={() => setLightbox(img)}
                  style={{ fontSize: ".72rem", fontWeight: 700, padding: "4px 12px", borderRadius: "6px", background: "rgba(34,211,238,.2)", color: "#22d3ee", border: "1px solid rgba(34,211,238,.3)", cursor: "pointer", fontFamily: "Exo 2, sans-serif" }}
                >
                  Preview
                </button>
                <button
                  onClick={() => handleDeleteImage(img)}
                  className="btn-danger"
                  style={{ padding: "4px 10px", fontSize: ".72rem" }}
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
              {/* Caption */}
              <div
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px",
                  background: "rgba(0,0,0,.65)",
                }}
              >
                <p style={{ color: "#94a3b8", fontSize: ".65rem", fontFamily: "Exo 2, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Album Modal */}
      {showAlbumModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAlbumModal(false)}>
          <div className="modal-box" style={{ maxWidth: "380px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "16px" }}>
              Create Album
            </h2>
            <label className="form-label">Album Name *</label>
            <input
              className="form-input"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="e.g. Laboratory Photos"
              onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
              style={{ marginBottom: "16px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleCreateAlbum} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                Create Album
              </button>
              <button onClick={() => setShowAlbumModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.95)", cursor: "pointer" }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.url}
            alt={lightbox.caption}
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "12px", objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: "16px", right: "16px", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(34,211,238,.15)", border: "1px solid rgba(34,211,238,.3)", color: "#22d3ee", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
          <p style={{ position: "absolute", bottom: "16px", color: "#94a3b8", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
            {lightbox.caption}
          </p>
        </div>
      )}
    </div>
  );
}
