"use client";
// src/components/portfolio/AboutSection.tsx
import type { Profile } from "@/types";

export default function AboutSection({ profile }: { profile: Profile | null }) {
  return (
    <section id="about" className="section-wrap" style={{ background: "linear-gradient(180deg,#020817 0%,#050f1e 100%)" }}>
      <div className="section-inner">
        <div className="text-center mb-16 scroll-reveal">
          <span className="tag-cyan sec-badge">WHO I AM</span>
          <h2 className="sec-title mt-2">About <span className="grad-text">Me</span></h2>
          <div className="sec-divider" />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="scroll-reveal">
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#22d3ee", fontFamily: "Exo 2, sans-serif", marginBottom: "14px" }}>
              Bridging Pharmacy & Data Science
            </h3>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: ".97rem", fontFamily: "Exo 2, sans-serif", marginBottom: "20px" }}>
              {profile?.about || "A motivated Bachelor of Pharmacy student with hands-on experience in herbal drug research, phytochemical screening, healthcare analytics, data visualization, and database management."}
            </p>
            {profile?.objective && (
              <div style={{ background: "rgba(34,211,238,.05)", border: "1px solid rgba(34,211,238,.15)", borderRadius: "12px", padding: "16px 18px" }}>
                <div style={{ color: "#22d3ee", fontWeight: 700, fontSize: ".82rem", fontFamily: "Exo 2, sans-serif", marginBottom: "8px", letterSpacing: ".05em" }}>CAREER OBJECTIVE</div>
                <p style={{ color: "#94a3b8", fontSize: ".875rem", lineHeight: 1.7, fontFamily: "Exo 2, sans-serif" }}>{profile.objective}</p>
              </div>
            )}
          </div>
          <div className="scroll-reveal">
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { v: "2", l: "Major Projects", icon: "🔬", c: "#22d3ee" },
                { v: "5+", l: "Skill Areas", icon: "💡", c: "#fbbf24" },
                { v: "DBATU", l: "University", icon: "🎓", c: "#22d3ee" },
                { v: "2026", l: "Graduating", icon: "📅", c: "#fbbf24" },
              ].map(({ v, l, icon, c }) => (
                <div key={l} className="glass p-4 text-center hover:scale-[1.02] transition-transform" style={{ borderColor: `${c}28` }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{icon}</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: c, fontFamily: "Exo 2, sans-serif" }}>{v}</div>
                  <div style={{ color: "#64748b", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="glass p-5">
              <div style={{ color: "#22d3ee", fontWeight: 800, fontFamily: "Exo 2, sans-serif", marginBottom: "12px", fontSize: ".9rem" }}>📍 Quick Info</div>
              {[
                ["Degree", "Bachelor of Pharmacy (B.Pharm)"],
                ["D.Pharm", "SVKM Institute of Pharmacy, Dhule"],
                ["University", "Dr. BATU, Lonere, Maharashtra"],
                ["Location", profile?.location || "Dhule, Maharashtra, India"],
                ["Email", profile?.email || "darshhugawade3@gmail.com"],
                ["Phone", profile?.phone || "8956875201"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.04)", fontSize: ".85rem" }}>
                  <span style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif" }}>{k}</span>
                  <span style={{ color: "#cbd5e1", fontWeight: 500, fontFamily: "Exo 2, sans-serif", textAlign: "right", maxWidth: "65%" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
