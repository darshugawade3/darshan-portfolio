"use client";
// src/components/portfolio/EducationSection.tsx
import { GraduationCap, Calendar, Award } from "lucide-react";
import type { Education } from "@/types";

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="section-wrap grid-bg" style={{ background: "#020817" }}>
      <div className="section-inner">
        <div className="text-center mb-14 scroll-reveal">
          <span className="tag-gold sec-badge">ACADEMIC JOURNEY</span>
          <h2 className="sec-title mt-2">My <span className="grad-text">Education</span></h2>
          <div className="sec-divider" />
        </div>
        {education.length === 0 ? (
          <div className="glass p-10 text-center max-w-lg mx-auto">
            <GraduationCap size={40} style={{ color: "#22d3ee", margin: "0 auto 12px", opacity: .5 }} />
            <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>Education details will appear here once added from Admin panel.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block" style={{ background: "linear-gradient(180deg,#22d3ee,#fbbf24,transparent)" }} />
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={edu.id} className="relative flex gap-6 scroll-reveal">
                  <div className="hidden md:flex w-16 h-16 rounded-full items-center justify-center flex-shrink-0 z-10"
                    style={{ background: edu.current || i === 0 ? "linear-gradient(135deg,#22d3ee,#0891b2)" : "rgba(34,211,238,.08)", border: `2px solid ${edu.current || i === 0 ? "#22d3ee" : "rgba(34,211,238,.25)"}`, boxShadow: edu.current || i === 0 ? "0 0 20px rgba(34,211,238,.4)" : "none" }}>
                    <GraduationCap size={22} style={{ color: edu.current || i === 0 ? "#020817" : "#22d3ee" }} />
                  </div>
                  <div className="flex-1 glass p-5 hover:scale-[1.005] transition-transform">
                    <div className="flex flex-wrap justify-between gap-3 mb-3">
                      <div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: edu.current || i === 0 ? "#22d3ee" : "#f8fafc", fontFamily: "Exo 2, sans-serif" }}>{edu.degree}</h3>
                        {edu.field && <p style={{ color: "#94a3b8", fontSize: ".85rem", fontFamily: "Exo 2, sans-serif" }}>{edu.field}</p>}
                        <p style={{ color: "#94a3b8", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>{edu.institute}</p>
                        <p style={{ color: "#64748b", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif" }}>{edu.university}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 items-end">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.25)" }}>
                          <Calendar size={12} style={{ color: "#fbbf24" }} />
                          <span style={{ color: "#fbbf24", fontSize: ".78rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>
                            {edu.startYear} – {edu.current ? "Present" : edu.endYear}
                          </span>
                        </div>
                        {edu.grade && <span style={{ color: "#22d3ee", fontWeight: 700, fontSize: ".85rem", fontFamily: "Exo 2, sans-serif" }}>{edu.grade}</span>}
                      </div>
                    </div>
                    {edu.achievements.length > 0 && (
                      <div>
                        <div style={{ color: "#fbbf24", fontSize: ".8rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
                          <Award size={13} />Achievements
                        </div>
                        <ul className="space-y-1">
                          {edu.achievements.map((a, j) => (
                            <li key={j} style={{ color: "#94a3b8", fontSize: ".82rem", fontFamily: "Exo 2, sans-serif", display: "flex", gap: "6px" }}>
                              <span style={{ color: "#22d3ee", flexShrink: 0 }}>▸</span>{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
