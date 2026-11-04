"use client";
// src/app/admin/dashboard/page.tsx — FIXED: removed white_space typo, fixed all TS issues
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, Download, MessageSquare, FolderOpen,
  Award, BookOpen, TrendingUp,
} from "lucide-react";
import {
  profileService, messagesService, projectsService,
  certificatesService, researchService, skillsService,
} from "@/lib/db";
import Link from "next/link";
import type { ContactMessage } from "@/types";

interface DashStats {
  visitors: number;
  downloads: number;
  messages: number;
  unread: number;
  projects: number;
  certificates: number;
  research: number;
  skills: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashStats>({
    visitors: 0, downloads: 0, messages: 0, unread: 0,
    projects: 0, certificates: 0, research: 0, skills: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    Promise.all([
      profileService.get(),
      messagesService.getAll(),
      messagesService.getUnread(),
      projectsService.getAll(),
      certificatesService.getAll(),
      researchService.getAll(),
      skillsService.getAll(),
    ]).then(([profile, msgs, unread, projects, certs, research, skills]) => {
      setStats({
        visitors: profile?.visitorCount ?? 0,
        downloads: profile?.downloadCount ?? 0,
        messages: msgs.length,
        unread: unread.length,
        projects: projects.length,
        certificates: certs.length,
        research: research.length,
        skills: skills.length,
      });
      setRecentMessages(msgs.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total Visitors",     value: stats.visitors,     icon: Users,         color: "#22d3ee", change: "+12%" },
    { label: "Resume Downloads",   value: stats.downloads,    icon: Download,      color: "#fbbf24", change: "+5%"  },
    { label: "Messages",           value: stats.messages,     icon: MessageSquare, color: "#a78bfa", change: `${stats.unread} unread` },
    { label: "Projects",           value: stats.projects,     icon: FolderOpen,    color: "#34d399", change: "Active" },
    { label: "Certificates",       value: stats.certificates, icon: Award,         color: "#f472b6", change: "Verified" },
    { label: "Research Works",     value: stats.research,     icon: BookOpen,      color: "#fb923c", change: "Published" },
  ];

  const pieData = [
    { name: "Projects",      value: stats.projects,      color: "#22d3ee" },
    { name: "Certs",         value: stats.certificates,  color: "#fbbf24" },
    { name: "Research",      value: stats.research,      color: "#a78bfa" },
    { name: "Skills",        value: stats.skills,        color: "#34d399" },
  ];

  const barData = [
    { name: "Mon", visits: 24 }, { name: "Tue", visits: 38 },
    { name: "Wed", visits: 31 }, { name: "Thu", visits: 45 },
    { name: "Fri", visits: 52 }, { name: "Sat", visits: 29 },
    { name: "Sun", visits: 18 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "960px" }}>
      {/* Welcome */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "4px" }}>
          Welcome back, <span className="grad-text">Darshan</span> 👋
        </h1>
        <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
          Here&apos;s what&apos;s happening with your portfolio today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="stat-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span style={{ fontSize: ".72rem", fontWeight: 600, padding: "3px 8px", borderRadius: "8px", background: "rgba(34,211,238,.06)", color: "#22d3ee", fontFamily: "Exo 2, sans-serif" }}>
                {change}
              </span>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color, fontFamily: "Exo 2, sans-serif", marginBottom: "2px" }}>
              {value.toLocaleString()}
            </div>
            <div style={{ color: "#64748b", fontSize: ".78rem", fontFamily: "Exo 2, sans-serif" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "18px", marginBottom: "20px" }}>
        {/* Bar */}
        <div className="glass" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <TrendingUp size={15} style={{ color: "#22d3ee" }} />
            <h3 style={{ color: "#f8fafc", fontWeight: 700, fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
              Weekly Visitors
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={barData} barSize={26}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#071428", border: "1px solid rgba(34,211,238,.2)", borderRadius: "8px", fontFamily: "Exo 2, sans-serif", fontSize: "12px" }}
                cursor={{ fill: "rgba(34,211,238,.05)" }}
              />
              <Bar dataKey="visits" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="glass" style={{ padding: "20px" }}>
          <h3 style={{ color: "#f8fafc", fontWeight: 700, fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", marginBottom: "14px" }}>
            Content Overview
          </h3>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={55} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#071428", border: "1px solid rgba(34,211,238,.2)", borderRadius: "8px", fontFamily: "Exo 2, sans-serif", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "8px" }}>
            {pieData.map(({ name, value, color }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                  <span style={{ color: "#94a3b8", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif" }}>{name}</span>
                </div>
                <span style={{ color: "#f8fafc", fontSize: ".78rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="glass" style={{ padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={15} style={{ color: "#22d3ee" }} />
            <h3 style={{ color: "#f8fafc", fontWeight: 700, fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
              Recent Messages
            </h3>
            {stats.unread > 0 && (
              <span style={{ fontSize: ".72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "50px", background: "#22d3ee", color: "#020817" }}>
                {stats.unread} new
              </span>
            )}
          </div>
          <Link href="/admin/messages" style={{ color: "#22d3ee", fontSize: ".8rem", fontFamily: "Exo 2, sans-serif", textDecoration: "none" }}>
            View all →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", textAlign: "center", padding: "16px 0" }}>
            No messages yet
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: msg.read ? "rgba(255,255,255,.02)" : "rgba(34,211,238,.05)",
                  border: `1px solid ${msg.read ? "rgba(255,255,255,.05)" : "rgba(34,211,238,.12)"}`,
                }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(34,211,238,.12)", color: "#22d3ee", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".85rem", flexShrink: 0, fontFamily: "Exo 2, sans-serif" }}>
                  {msg.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "#f8fafc", fontSize: ".85rem", fontWeight: 600, fontFamily: "Exo 2, sans-serif" }}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22d3ee" }} />
                    )}
                  </div>
                  <p style={{ color: "#64748b", fontSize: ".78rem", fontFamily: "Exo 2, sans-serif", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.subject} — {msg.message?.substring(0, 55)}...
                  </p>
                </div>
                <span style={{ color: "#64748b", fontSize: ".72rem", fontFamily: "Exo 2, sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {[
          { label: "Add Project",        href: "/admin/projects",     icon: "➕" },
          { label: "Upload Certificate", href: "/admin/certificates", icon: "🏆" },
          { label: "Update Skills",      href: "/admin/skills",       icon: "⚡" },
          { label: "Edit Profile",       href: "/admin/profile",      icon: "👤" },
        ].map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className="glass hover:scale-[1.02] transition-transform"
            style={{ padding: "16px", textAlign: "center", textDecoration: "none", display: "block" }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{icon}</div>
            <div style={{ color: "#94a3b8", fontSize: ".78rem", fontWeight: 600, fontFamily: "Exo 2, sans-serif" }}>
              {label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
