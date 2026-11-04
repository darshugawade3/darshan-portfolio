"use client";
// src/app/admin/layout.tsx
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { messagesService } from "@/lib/db";
import {
  LayoutDashboard, User, GraduationCap, Zap, FolderOpen,
  Award, Image, BookOpen, FileText, MessageSquare, LogOut,
  Menu, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/research", label: "Research", icon: BookOpen },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    if (user) {
      const unsub = messagesService.subscribeUnreadCount(setUnreadCount);
      return unsub;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020817" }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Logo */}
        <div
          className="p-5 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(34,211,238,.1)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: "linear-gradient(135deg, #22d3ee, #0891b2)", color: "#020817", fontFamily: "Exo 2, sans-serif" }}
          >
            DG
          </div>
          <div>
            <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
              Portfolio CMS
            </div>
            <div style={{ color: "#64748b", fontSize: ".72rem", fontFamily: "Exo 2, sans-serif" }}>
              Admin Panel
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden"
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div style={{ marginBottom: "8px", padding: "0 8px" }}>
            <span style={{ color: "#64748b", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".08em", fontFamily: "Exo 2, sans-serif" }}>
              MANAGEMENT
            </span>
          </div>
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`admin-nav-item ${active ? "active" : ""}`}
              >
                <Icon size={17} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && unreadCount > 0 && (
                  <span
                    className="text-xs font-bold rounded-full px-1.5 py-0.5"
                    style={{ background: "#22d3ee", color: "#020817", minWidth: "20px", textAlign: "center" }}
                  >
                    {unreadCount}
                  </span>
                )}
                {active && <ChevronRight size={13} style={{ color: "#22d3ee" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(34,211,238,.08)" }}>
          <Link
            href="/"
            target="_blank"
            className="admin-nav-item"
            style={{ marginBottom: "4px" }}
          >
            <span style={{ fontSize: "14px" }}>🌐</span>
            <span>View Portfolio</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item" style={{ color: "#ef4444" }}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main flex-1">
        {/* Top bar */}
        <div
          className="flex items-center gap-4 px-6 py-4 sticky top-0 z-30"
          style={{ background: "rgba(2,8,23,.95)", borderBottom: "1px solid rgba(34,211,238,.08)", backdropFilter: "blur(12px)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
            style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
          >
            <Menu size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: ".9rem", fontFamily: "Exo 2, sans-serif" }}>
              {NAV.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label || "Admin"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span style={{ color: "#94a3b8", fontSize: ".78rem", fontFamily: "Exo 2, sans-serif" }}>
              {user?.email}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
