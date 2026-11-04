"use client";
// src/components/portfolio/SkillsSection.tsx — FIXED: proper bar animation
import { useEffect, useRef, useState } from "react";
import type { Skill } from "@/types";

const CAT_CONFIG: Record<
  string,
  { label: string; icon: string; accent: string; bg: string; border: string }
> = {
  programming:  { label: "Programming",        icon: "💻", accent: "#22d3ee", bg: "rgba(34,211,238,.08)",  border: "rgba(34,211,238,.25)" },
  analytics:    { label: "Analytics & BI",      icon: "📊", accent: "#fbbf24", bg: "rgba(251,191,36,.08)",  border: "rgba(251,191,36,.25)" },
  research:     { label: "Research Skills",     icon: "🔬", accent: "#34d399", bg: "rgba(52,211,153,.08)",  border: "rgba(52,211,153,.25)" },
  professional: { label: "Professional Tools",  icon: "🛠",  accent: "#a78bfa", bg: "rgba(167,139,250,.08)", border: "rgba(167,139,250,.25)" },
};

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const sectionRef  = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !animated) setAnimated(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  const grouped = Object.keys(CAT_CONFIG).reduce<Record<string, Skill[]>>(
    (acc, cat) => { acc[cat] = skills.filter((s) => s.category === cat); return acc; },
    {}
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ padding: "96px 0", background: "linear-gradient(180deg,#050f1e 0%,#020817 100%)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Heading */}
        <div className="text-center scroll-reveal" style={{ marginBottom: "52px" }}>
          <span className="tag-cyan sec-badge">EXPERTISE</span>
          <h2 className="sec-title" style={{ marginTop: "10px" }}>
            Technical <span className="grad-text">Skills</span>
          </h2>
          <div className="sec-divider" />
        </div>

        {skills.length === 0 ? (
          <div
            className="glass"
            style={{ padding: "40px", textAlign: "center", maxWidth: "480px", margin: "0 auto" }}
          >
            <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>
              Skills will appear here once added from the Admin panel.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >
              {Object.entries(CAT_CONFIG).map(([cat, { label, icon, accent, bg, border }]) => {
                const catSkills = grouped[cat] ?? [];
                if (catSkills.length === 0) return null;
                return (
                  <div
                    key={cat}
                    className="glass scroll-reveal"
                    style={{ padding: "22px" }}
                  >
                    {/* Card header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <div
                        style={{
                          width: "40px", height: "40px", borderRadius: "10px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.15rem", background: bg, border: `1px solid ${border}`,
                        }}
                      >
                        {icon}
                      </div>
                      <span style={{ color: accent, fontWeight: 800, fontFamily: "Exo 2, sans-serif", fontSize: ".92rem" }}>
                        {label}
                      </span>
                    </div>

                    {/* Skills */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {catSkills.map((skill) => (
                        <div key={skill.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#cbd5e1", fontSize: ".875rem", fontWeight: 500, fontFamily: "Exo 2, sans-serif" }}>
                              {skill.name}
                            </span>
                            <span style={{ color: accent, fontSize: ".78rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>
                              {skill.level}%
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div
                            style={{
                              height: "6px", background: "rgba(255,255,255,.06)",
                              borderRadius: "50px", overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: animated ? `${skill.level}%` : "0%",
                                background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                                borderRadius: "50px",
                                transition: "width 1.4s cubic-bezier(.4,0,.2,1)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech stack pills */}
            <div
              className="scroll-reveal"
              style={{ textAlign: "center", marginTop: "40px" }}
            >
              <div
                style={{
                  color: "#64748b", fontFamily: "Exo 2, sans-serif",
                  fontSize: ".78rem", fontWeight: 700, letterSpacing: ".06em",
                  textTransform: "uppercase", marginBottom: "14px",
                }}
              >
                Technology Stack
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {skills.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      background: "rgba(34,211,238,.05)",
                      border: "1px solid rgba(34,211,238,.14)",
                      color: "#94a3b8", borderRadius: "50px",
                      padding: "5px 16px", fontSize: ".82rem", fontWeight: 600,
                      fontFamily: "Exo 2, sans-serif",
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
