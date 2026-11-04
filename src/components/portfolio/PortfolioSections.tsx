"use client";
// src/components/portfolio/PortfolioSections.tsx
// FIX: useState import moved to TOP, all hooks properly imported

import { useState } from "react";
import { Award, Calendar, ExternalLink } from "lucide-react";
import type {
  Certificate, ResearchWork, GalleryImage,
  GalleryAlbum, Achievement, Profile,
} from "@/types";

// ─────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────
export function CertificationsSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section
      id="certifications"
      style={{ padding: "96px 0", background: "linear-gradient(180deg,#050f1e 0%,#020817 100%)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-cyan sec-badge">CREDENTIALS</span>
          <h2 className="sec-title mt-2">
            Certifications &amp; <span className="grad-text">Courses</span>
          </h2>
          <div className="sec-divider" />
        </div>

        {certificates.length === 0 ? (
          <div
            className="glass p-10 text-center"
            style={{ maxWidth: "480px", margin: "0 auto" }}
          >
            <Award size={40} style={{ color: "#fbbf24", margin: "0 auto 10px", opacity: 0.5 }} />
            <p
              style={{
                color: "#64748b",
                fontFamily: "Exo 2, sans-serif",
                fontSize: ".875rem",
              }}
            >
              Certifications will appear here once added from the Admin panel.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass hover:scale-[1.02] transition-transform scroll-reveal"
                style={{
                  padding: "18px",
                  borderColor: "rgba(251,191,36,.18)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-4"
                  style={{
                    aspectRatio: "16/9",
                    background: "rgba(251,191,36,.05)",
                    border: "1px solid rgba(251,191,36,.12)",
                    overflow: "hidden",
                  }}
                >
                  {cert.imageURL ? (
                    <img
                      src={cert.imageURL}
                      alt={cert.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Award size={36} style={{ color: "#fbbf24", opacity: 0.5 }} />
                  )}
                </div>
                <h3
                  style={{
                    color: "#f8fafc",
                    fontWeight: 700,
                    fontSize: ".875rem",
                    fontFamily: "Exo 2, sans-serif",
                    marginBottom: "4px",
                  }}
                >
                  {cert.title}
                </h3>
                <p
                  style={{
                    color: "#22d3ee",
                    fontSize: ".8rem",
                    fontFamily: "Exo 2, sans-serif",
                  }}
                >
                  {cert.organization}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: ".75rem",
                      fontFamily: "Exo 2, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Calendar size={11} />
                    {cert.date}
                  </span>
                  {cert.pdfURL && (
                    <a
                      href={cert.pdfURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#22d3ee",
                        fontSize: ".75rem",
                        fontFamily: "Exo 2, sans-serif",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <ExternalLink size={11} />
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// RESEARCH
// ─────────────────────────────────────────────
const TYPE_ICONS: Record<string, string> = {
  paper: "📄",
  poster: "🖼",
  presentation: "📑",
  report: "📋",
  publication: "📰",
};

export function ResearchSection({ research }: { research: ResearchWork[] }) {
  return (
    <section
      id="research"
      style={{
        padding: "96px 0",
        background: "#020817",
        backgroundImage:
          "linear-gradient(rgba(34,211,238,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.04) 1px,transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-purple sec-badge">ACADEMIC WORK</span>
          <h2 className="sec-title mt-2">
            Research <span className="grad-text">Portfolio</span>
          </h2>
          <div className="sec-divider" />
        </div>

        {research.length === 0 ? (
          <div
            className="glass p-10 text-center"
            style={{ maxWidth: "480px", margin: "0 auto" }}
          >
            <p
              style={{
                color: "#64748b",
                fontFamily: "Exo 2, sans-serif",
                fontSize: ".875rem",
              }}
            >
              Research works will appear here once added from the Admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {research.map((r) => (
              <div
                key={r.id}
                className="glass hover:scale-[1.005] transition-transform scroll-reveal"
                style={{ padding: "14px 18px", display: "flex", gap: "14px", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    flexShrink: 0,
                    background: "rgba(167,139,250,.08)",
                    border: "1px solid rgba(167,139,250,.2)",
                  }}
                >
                  {TYPE_ICONS[r.type] ?? "📄"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      color: "#f8fafc",
                      fontWeight: 700,
                      fontFamily: "Exo 2, sans-serif",
                      marginBottom: "4px",
                      fontSize: ".9rem",
                    }}
                  >
                    {r.title}
                  </h3>
                  {r.authors.length > 0 && (
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: ".78rem",
                        fontFamily: "Exo 2, sans-serif",
                        marginBottom: "4px",
                      }}
                    >
                      Authors: {r.authors.join(", ")}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <span className="tag-purple" style={{ fontSize: ".68rem" }}>
                      {r.type}
                    </span>
                    <span
                      style={{
                        color: "#64748b",
                        fontSize: ".75rem",
                        fontFamily: "Exo 2, sans-serif",
                      }}
                    >
                      {r.year}
                    </span>
                    {r.doi && (
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: ".72rem",
                          fontFamily: "Exo 2, sans-serif",
                        }}
                      >
                        DOI: {r.doi}
                      </span>
                    )}
                  </div>
                  {r.abstract && (
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: ".8rem",
                        fontFamily: "Exo 2, sans-serif",
                        marginTop: "5px",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {r.abstract}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {r.fileURL && (
                    <a
                      href={r.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: "6px 12px", fontSize: ".75rem" }}
                    >
                      📄 View
                    </a>
                  )}
                  {r.pptURL && (
                    <a
                      href={r.pptURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                      style={{ padding: "6px 12px", fontSize: ".75rem" }}
                    >
                      📊 PPT
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────
export function GallerySection({
  images,
  albums,
}: {
  images: GalleryImage[];
  albums: GalleryAlbum[];
}) {
  const [activeAlbum, setActiveAlbum] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    activeAlbum === "all" ? images : images.filter((i) => i.album === activeAlbum);

  return (
    <section
      id="gallery"
      style={{ padding: "96px 0", background: "linear-gradient(180deg,#050f1e 0%,#020817 100%)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-gold sec-badge">VISUAL PORTFOLIO</span>
          <h2 className="sec-title mt-2">
            Photo <span className="grad-text">Gallery</span>
          </h2>
          <div className="sec-divider" />
        </div>

        {images.length === 0 ? (
          <div
            className="glass p-10 text-center"
            style={{ maxWidth: "480px", margin: "0 auto" }}
          >
            <p
              style={{
                color: "#64748b",
                fontFamily: "Exo 2, sans-serif",
                fontSize: ".875rem",
              }}
            >
              Gallery photos will appear here once added from the Admin panel.
            </p>
          </div>
        ) : (
          <>
            {/* Filter buttons */}
            <div
              className="scroll-reveal"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <button
                onClick={() => setActiveAlbum("all")}
                style={{
                  padding: "6px 18px",
                  borderRadius: "50px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Exo 2, sans-serif",
                  fontSize: ".82rem",
                  fontWeight: 700,
                  background:
                    activeAlbum === "all"
                      ? "linear-gradient(135deg,#22d3ee,#0891b2)"
                      : "rgba(34,211,238,.06)",
                  color: activeAlbum === "all" ? "#020817" : "#94a3b8",
                  transition: "all .3s",
                }}
              >
                All ({images.length})
              </button>
              {albums.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setActiveAlbum(a.id)}
                  style={{
                    padding: "6px 18px",
                    borderRadius: "50px",
                    border: "1px solid rgba(34,211,238,.18)",
                    cursor: "pointer",
                    fontFamily: "Exo 2, sans-serif",
                    fontSize: ".82rem",
                    fontWeight: 700,
                    background:
                      activeAlbum === a.id
                        ? "linear-gradient(135deg,#22d3ee,#0891b2)"
                        : "rgba(34,211,238,.06)",
                    color: activeAlbum === a.id ? "#020817" : "#94a3b8",
                    transition: "all .3s",
                  }}
                >
                  {a.name}
                </button>
              ))}
            </div>

            {/* Masonry grid */}
            <div
              className="scroll-reveal"
              style={{ columns: "2 200px", columnGap: "12px" }}
            >
              {filtered.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightbox(img)}
                  style={{
                    breakInside: "avoid",
                    marginBottom: "12px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(34,211,238,.12)",
                    cursor: "pointer",
                    transition: "transform .3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    style={{ width: "100%", display: "block" }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.95)",
          }}
        >
          <img
            src={lightbox.url}
            alt={lightbox.caption}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "12px",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(34,211,238,.15)",
              border: "1px solid rgba(34,211,238,.3)",
              color: "#22d3ee",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────
export function AchievementsSection({
  achievements,
}: {
  achievements: Achievement[];
}) {
  return (
    <section
      id="achievements"
      style={{
        padding: "96px 0",
        background: "#020817",
        backgroundImage:
          "linear-gradient(rgba(34,211,238,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.04) 1px,transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-cyan sec-badge">MILESTONES</span>
          <h2 className="sec-title mt-2">
            Achievements &amp; <span className="grad-text">Awards</span>
          </h2>
          <div className="sec-divider" />
        </div>

        {achievements.length === 0 ? (
          <p
            style={{
              color: "#64748b",
              fontFamily: "Exo 2, sans-serif",
              textAlign: "center",
            }}
          >
            Add achievements from the Admin panel.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((a, i) => (
              <div
                key={a.id}
                className="glass hover:scale-[1.02] transition-transform scroll-reveal"
                style={{
                  padding: "20px",
                  borderColor:
                    i % 2 === 0
                      ? "rgba(34,211,238,.2)"
                      : "rgba(251,191,36,.2)",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>
                  {a.icon}
                </div>
                <span
                  style={{
                    fontSize: ".72rem",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: "50px",
                    display: "inline-block",
                    marginBottom: "8px",
                    background:
                      i % 2 === 0
                        ? "rgba(34,211,238,.1)"
                        : "rgba(251,191,36,.1)",
                    color: i % 2 === 0 ? "#22d3ee" : "#fbbf24",
                    fontFamily: "Exo 2, sans-serif",
                    border: `1px solid ${i % 2 === 0 ? "rgba(34,211,238,.25)" : "rgba(251,191,36,.25)"}`,
                  }}
                >
                  {a.category}
                </span>
                <h3
                  style={{
                    color: "#f8fafc",
                    fontWeight: 800,
                    fontFamily: "Exo 2, sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  {a.title}
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: ".85rem",
                    fontFamily: "Exo 2, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {a.description}
                </p>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: ".75rem",
                    marginTop: "8px",
                    fontFamily: "Exo 2, sans-serif",
                  }}
                >
                  📅 {a.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────
export function ContactSection({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { messagesService } = await import("@/lib/db");
      await messagesService.add({
        ...form,
        createdAt: new Date().toISOString(),
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      alert("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      style={{
        padding: "96px 0",
        background: "linear-gradient(180deg,#050f1e 0%,#020817 100%)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-gold sec-badge">GET IN TOUCH</span>
          <h2 className="sec-title mt-2">
            Contact <span className="grad-text">Me</span>
          </h2>
          <div className="sec-divider" />
          <p
            style={{
              color: "#94a3b8",
              marginTop: "14px",
              fontSize: ".95rem",
              fontFamily: "Exo 2, sans-serif",
            }}
          >
            Open to research collaborations, internships, and professional
            connections.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="scroll-reveal">
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#22d3ee",
                fontFamily: "Exo 2, sans-serif",
                marginBottom: "20px",
              }}
            >
              Let&apos;s Connect
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: "✉",
                  label: "Email",
                  value: profile?.email || "darshhugawade3@gmail.com",
                  href: `mailto:${profile?.email || "darshhugawade3@gmail.com"}`,
                  color: "#22d3ee",
                },
                {
                  icon: "📞",
                  label: "Phone",
                  value: profile?.phone || "8956875201",
                  href: `tel:${profile?.phone || "8956875201"}`,
                  color: "#fbbf24",
                },
                {
                  icon: "📍",
                  label: "Location",
                  value: profile?.location || "Dhule, Maharashtra, India",
                  href: "#",
                  color: "#22d3ee",
                },
                {
                  icon: "in",
                  label: "LinkedIn",
                  value: "darshan-gawade-3646bb406",
                  href:
                    profile?.linkedin ||
                    "https://www.linkedin.com/in/darshan-gawade-3646bb406/",
                  color: "#0077b5",
                },
              ].map(({ icon, label, value, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="glass hover:scale-[1.01] transition-transform"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px",
                    textDecoration: "none",
                    borderRadius: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: `${color}12`,
                      border: `1px solid ${color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color,
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: ".72rem",
                        fontFamily: "Exo 2, sans-serif",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: ".875rem",
                        fontFamily: "Exo 2, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass scroll-reveal" style={{ padding: "24px" }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#fbbf24",
                fontFamily: "Exo 2, sans-serif",
                marginBottom: "20px",
              }}
            >
              Send a Message
            </h3>
            {sent ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>✅</div>
                <h4
                  style={{
                    color: "#34d399",
                    fontWeight: 700,
                    fontFamily: "Exo 2, sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  Message Sent!
                </h4>
                <p
                  style={{
                    color: "#94a3b8",
                    fontFamily: "Exo 2, sans-serif",
                    fontSize: ".875rem",
                  }}
                >
                  Thank you for reaching out. I&apos;ll reply soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-secondary"
                  style={{ marginTop: "16px", fontSize: ".85rem" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Name *</label>
                    <input
                      className="form-input"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Subject *</label>
                  <input
                    className="form-input"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    required
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    rows={5}
                    className="form-input"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    required
                    placeholder="Your message..."
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center"
                  style={{ opacity: sending ? 0.7 : 1 }}
                >
                  ✉ {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
export function Footer({ profile }: { profile: Profile | null }) {
  return (
    <footer
      style={{
        background: "#020817",
        borderTop: "1px solid rgba(34,211,238,.08)",
        padding: "32px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
        }}
      >
        <div>
          <div
            className="grad-text"
            style={{
              fontWeight: 900,
              fontSize: "1.1rem",
              fontFamily: "Exo 2, sans-serif",
            }}
          >
            {profile?.name || "Darshan Suresh Gawade"}
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: ".78rem",
              fontFamily: "Exo 2, sans-serif",
              marginTop: "2px",
            }}
          >
            {profile?.title ||
              "B.Pharm Student | Pharmaceutical Researcher | Healthcare Data Analyst"}
          </div>
        </div>
        <div
          style={{
            color: "#64748b",
            fontSize: ".8rem",
            fontFamily: "Exo 2, sans-serif",
          }}
        >
          © {new Date().getFullYear()} · Built with ❤️ · Powered by Firebase
        </div>
      </div>
    </footer>
  );
}
