"use client";
// src/components/portfolio/Navbar.tsx
import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { profileService } from "@/lib/db";
import type { Profile } from "@/types";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ profile }: { profile: Profile | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleDownload = () => {
    if (profile?.resumeURL) {
      profileService.incrementDownload().catch(() => {});
      window.open(profile.resumeURL, "_blank");
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(2,8,23,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,211,238,.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-6">
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#22d3ee,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "13px", color: "#020817", fontFamily: "Exo 2, sans-serif" }}>DG</div>
          <span className="hidden sm:block" style={{ fontWeight: 800, fontSize: ".95rem", color: "#f8fafc", fontFamily: "Exo 2, sans-serif" }}>
            {profile?.name?.split(" ")[0] || "Darshan"}{" "}
            <span style={{ color: "#22d3ee" }}>{profile?.name?.split(" ").slice(1).join(" ") || "Gawade"}</span>
          </span>
        </a>

        <div className="hidden md:flex gap-5 flex-1 justify-center">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{ color: "#94a3b8", textDecoration: "none", fontSize: ".875rem", fontWeight: 500, fontFamily: "Exo 2, sans-serif", transition: "color .3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          {profile?.resumeURL && (
            <button onClick={handleDownload} className="btn-primary" style={{ padding: "8px 18px", fontSize: ".82rem" }}>
              <Download size={14} />Resume
            </button>
          )}
          <a href="/admin/dashboard" style={{ color: "#64748b", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif", textDecoration: "none" }}>Admin</a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto" style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ background: "rgba(2,8,23,.98)", borderTop: "1px solid rgba(34,211,238,.08)", padding: "12px 16px" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", color: "#94a3b8", textDecoration: "none", padding: "10px 12px", borderRadius: "8px", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem", fontWeight: 500 }}>
              {l.label}
            </a>
          ))}
          {profile?.resumeURL && (
            <button onClick={handleDownload} className="btn-primary w-full justify-center mt-2">
              <Download size={14} />Download Resume
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
