"use client";
// src/components/portfolio/ProjectsSection.tsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Download, Eye, ExternalLink, Github } from "lucide-react";
import { projectsService } from "@/lib/db";
import type { Project } from "@/types";

const COLOR_MAP: Record<string, { accent: string; bg: string; border: string }> = {
  cyan:   { accent: "#22d3ee", bg: "rgba(34,211,238,.04)",  border: "rgba(34,211,238,.22)" },
  gold:   { accent: "#fbbf24", bg: "rgba(251,191,36,.04)",  border: "rgba(251,191,36,.22)" },
  purple: { accent: "#a78bfa", bg: "rgba(167,139,250,.04)", border: "rgba(167,139,250,.22)" },
  green:  { accent: "#34d399", bg: "rgba(52,211,153,.04)",  border: "rgba(52,211,153,.22)" },
};

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState<string | null>(projects[0]?.id || null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const toggle = async (id: string) => {
    if (expanded !== id) {
      setExpanded(id);
      await projectsService.incrementView(id).catch(() => {});
    } else {
      setExpanded(null);
    }
  };

  return (
    <section id="projects" className="section-wrap grid-bg" style={{ background: "#020817" }}>
      <div className="section-inner">
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-gold sec-badge">FEATURED WORK</span>
          <h2 className="sec-title mt-2">My <span className="grad-text">Projects</span></h2>
          <div className="sec-divider" />
        </div>

        {projects.length === 0 ? (
          <div className="glass p-10 text-center max-w-lg mx-auto">
            <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>Projects will appear here once added from the Admin panel.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {projects.map((p, i) => {
              const c = COLOR_MAP[p.color] || COLOR_MAP.cyan;
              const open = expanded === p.id;
              return (
                <div key={p.id} className="glass scroll-reveal overflow-hidden transition-all" style={{ borderColor: c.border }}>
                  {/* Header */}
                  <div
                    onClick={() => toggle(p.id)}
                    className="p-5 cursor-pointer flex gap-4 items-start"
                    style={{ background: open ? c.bg : "transparent", borderBottom: open ? `1px solid ${c.border}` : "none" }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                      {p.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span style={{ fontSize: ".72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: c.bg, color: c.accent, fontFamily: "Exo 2, sans-serif" }}>
                          PROJECT {String(i + 1).padStart(2, "0")}
                        </span>
                        {p.featured && <span className="tag-gold" style={{ fontSize: ".66rem" }}>⭐ Featured</span>}
                        <span className={`status-${p.status}`}>{p.status}</span>
                        <span style={{ color: "#64748b", fontSize: ".72rem", fontFamily: "Exo 2, sans-serif", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Eye size={10} />{p.viewCount || 0}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "#f8fafc", fontFamily: "Exo 2, sans-serif", lineHeight: 1.3, marginBottom: "3px" }}>{p.title}</h3>
                      <p style={{ color: c.accent, fontSize: ".85rem", fontFamily: "Exo 2, sans-serif", fontWeight: 500 }}>{p.subtitle}</p>
                    </div>
                    <div className="flex-shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "8px", padding: "6px", color: c.accent }}>
                      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Body */}
                  {open && (
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tags.map((t) => <span key={t} style={{ background: `${c.accent}12`, border: `1px solid ${c.accent}28`, color: c.accent, borderRadius: "50px", padding: "2px 10px", fontSize: ".7rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>{t}</span>)}
                      </div>
                      <p style={{ color: "#94a3b8", lineHeight: 1.8, fontFamily: "Exo 2, sans-serif", marginBottom: "20px", fontSize: ".95rem" }}>
                        {p.longDescription || p.description}
                      </p>

                      <div className="grid md:grid-cols-3 gap-4 mb-5">
                        {/* Objectives */}
                        <div style={{ background: "rgba(34,211,238,.03)", border: "1px solid rgba(34,211,238,.1)", borderRadius: "12px", padding: "14px" }}>
                          <div style={{ color: "#22d3ee", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".85rem", marginBottom: "8px" }}>🎯 Objectives</div>
                          <ul className="space-y-1.5">
                            {(p.objectives || []).map((o, j) => (
                              <li key={j} style={{ color: "#94a3b8", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", display: "flex", gap: "5px" }}>
                                <span style={{ color: "#22d3ee", flexShrink: 0 }}>▸</span>{o}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Methodology */}
                        {p.methodology && (
                          <div style={{ background: "rgba(251,191,36,.03)", border: "1px solid rgba(251,191,36,.1)", borderRadius: "12px", padding: "14px" }}>
                            <div style={{ color: "#fbbf24", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".85rem", marginBottom: "8px" }}>🔬 Methodology</div>
                            <p style={{ color: "#94a3b8", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", lineHeight: 1.7 }}>{p.methodology}</p>
                          </div>
                        )}
                        {/* Results */}
                        {p.results && (
                          <div style={{ background: "rgba(52,211,153,.03)", border: "1px solid rgba(52,211,153,.1)", borderRadius: "12px", padding: "14px" }}>
                            <div style={{ color: "#34d399", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".85rem", marginBottom: "8px" }}>✅ Results</div>
                            <p style={{ color: "#94a3b8", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", lineHeight: 1.7 }}>{p.results}</p>
                          </div>
                        )}
                      </div>

                      {/* Future Scope */}
                      {p.futureScope && (
                        <div style={{ background: "rgba(167,139,250,.04)", border: "1px solid rgba(167,139,250,.12)", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
                          <div style={{ color: "#a78bfa", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".85rem", marginBottom: "6px" }}>🚀 Future Scope</div>
                          <p style={{ color: "#94a3b8", fontSize: ".85rem", fontFamily: "Exo 2, sans-serif", lineHeight: 1.7 }}>{p.futureScope}</p>
                        </div>
                      )}

                      {/* Images */}
                      {p.images && p.images.length > 0 && (
                        <div className="mb-5">
                          <div style={{ color: "#94a3b8", fontSize: ".8rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif", marginBottom: "10px", letterSpacing: ".05em" }}>PROJECT IMAGES</div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {p.images.map((img, j) => (
                              <div key={j} className="aspect-video rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform"
                                style={{ border: `1px solid ${c.border}` }}
                                onClick={() => setLightboxImg(img.url)}>
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {p.pdfReport?.url && (
                          <a href={p.pdfReport.url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: ".82rem", padding: "8px 16px" }}>
                            <Download size={14} />Download Report
                          </a>
                        )}
                        {p.pptFile?.url && (
                          <a href={p.pptFile.url} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: ".82rem", padding: "8px 16px" }}>
                            <Download size={14} />Presentation
                          </a>
                        )}
                        {p.githubURL && (
                          <a href={p.githubURL} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: ".82rem", padding: "8px 16px" }}>
                            <Github size={14} />GitHub
                          </a>
                        )}
                        {p.liveURL && (
                          <a href={p.liveURL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: ".82rem", padding: "8px 16px" }}>
                            <ExternalLink size={14} />Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Project" className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(34,211,238,.15)", border: "1px solid rgba(34,211,238,.3)", color: "#22d3ee" }} onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}
    </section>
  );
}
