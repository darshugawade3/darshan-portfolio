"use client";
// src/components/portfolio/HeroSection.tsx
import { useEffect, useState } from "react";
import { Download, Eye, Mail, Linkedin, Github, ChevronDown } from "lucide-react";
import { profileService } from "@/lib/db";
import type { Profile } from "@/types";

function useTyping(texts: string[]) {
  const [text, setText] = useState("");
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[ti] || "";
    let t: ReturnType<typeof setTimeout>;
    if (!del && ci < cur.length) { t = setTimeout(() => setCi((c) => c + 1), 80); }
    else if (!del && ci === cur.length) { t = setTimeout(() => setDel(true), 2200); }
    else if (del && ci > 0) { t = setTimeout(() => setCi((c) => c - 1), 40); }
    else { setDel(false); setTi((i) => (i + 1) % texts.length); }
    setText(cur.slice(0, ci));
    return () => clearTimeout(t);
  }, [ci, del, ti, texts]);
  return text;
}

const DEFAULT_TYPING = ["Pharmaceutical Researcher", "Healthcare Data Analyst", "B.Pharm Student", "Phytochemistry Expert", "Power BI Developer"];

export default function HeroSection({ profile }: { profile: Profile | null }) {
  const typed = useTyping(DEFAULT_TYPING);

  const handleDownload = () => {
    if (profile?.resumeURL) {
      profileService.incrementDownload().catch(() => {});
      window.open(profile.resumeURL, "_blank");
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg,#020817 0%,#050f1e 50%,#020817 100%)" }}>
      <div className="absolute inset-0 grid-bg" style={{ opacity: .5 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%,rgba(34,211,238,.07) 0%,transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 mb-6" style={{ background: "rgba(34,211,238,.07)", border: "1px solid rgba(34,211,238,.22)", borderRadius: "50px", padding: "6px 18px" }}>
              <div className="pulse-dot" />
              <span style={{ color: "#22d3ee", fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", fontFamily: "Exo 2, sans-serif" }}>AVAILABLE FOR OPPORTUNITIES</span>
            </div>

            <h1 style={{ fontFamily: "Exo 2, sans-serif", fontSize: "clamp(2.5rem,6vw,4.2rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "14px", color: "#f8fafc" }}>
              Hi, I'm{" "}
              <span className="grad-text">{profile?.name || "Darshan Gawade"}</span>
            </h1>

            <div style={{ fontSize: "clamp(1.1rem,2.5vw,1.45rem)", fontWeight: 600, color: "#22d3ee", minHeight: "2.5em", marginBottom: "16px", fontFamily: "Exo 2, sans-serif" }}>
              <span className="typing-cursor">{typed}</span>
            </div>

            <p style={{ color: "#94a3b8", lineHeight: 1.75, marginBottom: "28px", maxWidth: "480px", fontSize: ".97rem", fontFamily: "Exo 2, sans-serif" }}>
              {profile?.bio || "B.Pharm Student | Pharmaceutical Researcher | Healthcare Data Analyst | Data Visualization Enthusiast"}
            </p>

            {/* Visitor counter */}
            {profile?.visitorCount != null && (
              <div className="inline-flex items-center gap-2 mb-6" style={{ background: "rgba(251,191,36,.07)", border: "1px solid rgba(251,191,36,.18)", borderRadius: "50px", padding: "4px 14px" }}>
                <Eye size={12} style={{ color: "#fbbf24" }} />
                <span style={{ color: "#fbbf24", fontSize: ".75rem", fontWeight: 600, fontFamily: "Exo 2, sans-serif" }}>
                  {(profile.visitorCount || 0).toLocaleString()} visitors
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <button onClick={handleDownload} className="btn-primary"><Download size={16} />Download Resume</button>
              <a href="#projects" className="btn-secondary"><Eye size={16} />View Projects</a>
              <a href="#contact" className="btn-gold"><Mail size={16} />Contact Me</a>
            </div>

            <div className="flex gap-3 justify-center lg:justify-start">
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(0,119,181,.15)", border: "1px solid rgba(0,119,181,.3)", color: "#0077b5" }}>
                  <Linkedin size={18} />
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#94a3b8" }}>
                  <Github size={18} />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.2)", color: "#22d3ee" }}>
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="absolute" style={{ width: "370px", height: "370px", borderRadius: "50%", border: "1px dashed rgba(34,211,238,.18)", top: "-20px", left: "-20px", animation: "spinSlow 25s linear infinite" }} />
            <div className="absolute" style={{ width: "320px", height: "320px", borderRadius: "50%", border: "1px dashed rgba(251,191,36,.12)", top: "5px", left: "5px", animation: "spinSlow 18s linear infinite reverse" }} />
            <div className="relative z-10" style={{ width: "300px", height: "300px", borderRadius: "50%", border: "3px solid transparent", background: "linear-gradient(#020817,#020817) padding-box, linear-gradient(135deg,#22d3ee,#fbbf24) border-box", boxShadow: "0 0 40px rgba(34,211,238,.3),0 0 80px rgba(34,211,238,.1)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(135deg,#071428,#0a1c38)", width: "100%", height: "100%", justifyContent: "center" }}>
                  <div style={{ fontSize: "4.5rem", marginBottom: "8px" }}>👨‍🔬</div>
                  <span style={{ color: "#22d3ee", fontSize: ".72rem", fontWeight: 600, fontFamily: "Exo 2, sans-serif", opacity: .6 }}>Upload photo in Admin</span>
                </div>
              )}
            </div>
            <div className="absolute" style={{ bottom: "-8px", left: "-16px", background: "rgba(5,15,30,.9)", border: "1px solid rgba(34,211,238,.2)", backdropFilter: "blur(10px)", borderRadius: "10px", padding: "8px 12px" }}>
              <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>🔬 B.Pharm</div>
              <div style={{ color: "#94a3b8", fontSize: ".65rem", fontFamily: "Exo 2, sans-serif" }}>First class</div>
            </div>
            <div className="absolute" style={{ top: "-8px", right: "-16px", background: "rgba(5,15,30,.9)", border: "1px solid rgba(34,211,238,.2)", backdropFilter: "blur(10px)", borderRadius: "10px", padding: "8px 12px" }}>
              <div style={{ color: "#22d3ee", fontWeight: 700, fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>📊 Analytics</div>
              <div style={{ color: "#94a3b8", fontSize: ".65rem", fontFamily: "Exo 2, sans-serif" }}>Python · SQL</div>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1" style={{ textDecoration: "none" }}>
        <span style={{ color: "#64748b", fontSize: ".7rem", fontFamily: "Exo 2, sans-serif", letterSpacing: ".1em" }}>SCROLL</span>
        <ChevronDown size={20} style={{ color: "#22d3ee", animation: "bounce 2s infinite" }} />
      </a>
    </section>
  );
}
