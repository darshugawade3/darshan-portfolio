"use client";
// src/app/admin/messages/page.tsx — FIXED: combined useState+useEffect imports, removed Check import
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Mail, Trash2, Eye } from "lucide-react";
import { messagesService } from "@/lib/db";
import type { ContactMessage } from "@/types";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await messagesService.getAll();
      setMessages(data);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (msg: ContactMessage) => {
    if (!msg.read) {
      await messagesService.markRead(msg.id);
      setMessages((m) =>
        m.map((x) => (x.id === msg.id ? { ...x, read: true } : x))
      );
    }
    setSelected({ ...msg, read: true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await messagesService.delete(id);
      setMessages((m) => m.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Message deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Exo 2, sans-serif", color: "#f8fafc", marginBottom: "4px" }}>
          Messages
        </h1>
        <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
          {messages.length} total · {unreadCount} unread
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* List */}
        <div className="glass" style={{ padding: "16px", maxHeight: "600px", overflowY: "auto" }}>
          <h3 style={{ color: "#22d3ee", fontWeight: 700, fontFamily: "Exo 2, sans-serif", fontSize: ".875rem", marginBottom: "14px" }}>
            Inbox
          </h3>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Mail size={32} style={{ color: "#64748b", margin: "0 auto 8px" }} />
              <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
                No messages yet
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => markRead(msg)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all .25s",
                    background:
                      selected?.id === msg.id
                        ? "rgba(34,211,238,.1)"
                        : msg.read
                        ? "rgba(255,255,255,.02)"
                        : "rgba(34,211,238,.05)",
                    border: `1px solid ${
                      selected?.id === msg.id
                        ? "rgba(34,211,238,.3)"
                        : msg.read
                        ? "rgba(255,255,255,.05)"
                        : "rgba(34,211,238,.12)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(34,211,238,.12)", color: "#22d3ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", fontWeight: 700, flexShrink: 0, fontFamily: "Exo 2, sans-serif" }}>
                      {msg.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ color: "#f8fafc", fontSize: ".84rem", fontWeight: 600, fontFamily: "Exo 2, sans-serif" }}>
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22d3ee", flexShrink: 0 }} />
                        )}
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: ".75rem", fontFamily: "Exo 2, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.subject}
                      </p>
                      <p style={{ color: "#64748b", fontSize: ".7rem", fontFamily: "Exo 2, sans-serif", marginTop: "1px" }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="glass" style={{ padding: "20px" }}>
          {selected ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                <h3 style={{ color: "#22d3ee", fontWeight: 700, fontFamily: "Exo 2, sans-serif" }}>
                  Message Detail
                </h3>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="btn-danger"
                  style={{ padding: "6px 12px", fontSize: ".8rem" }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "From",    value: selected.name    },
                  { label: "Email",   value: selected.email   },
                  { label: "Subject", value: selected.subject },
                  {
                    label: "Date",
                    value: new Date(selected.createdAt).toLocaleString(),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ color: "#64748b", fontSize: ".72rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif", letterSpacing: ".06em", marginBottom: "2px", textTransform: "uppercase" }}>
                      {label}
                    </div>
                    <div style={{ color: "#f8fafc", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
                      {value}
                    </div>
                  </div>
                ))}

                <div>
                  <div style={{ color: "#64748b", fontSize: ".72rem", fontWeight: 700, fontFamily: "Exo 2, sans-serif", letterSpacing: ".06em", marginBottom: "8px", textTransform: "uppercase" }}>
                    Message
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif", lineHeight: 1.7, background: "rgba(255,255,255,.03)", borderRadius: "8px", padding: "12px", border: "1px solid rgba(255,255,255,.06)" }}>
                    {selected.message}
                  </div>
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="btn-primary"
                  style={{ justifyContent: "center", marginTop: "4px" }}
                >
                  <Mail size={15} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "240px" }}>
              <Eye size={32} style={{ color: "#64748b", marginBottom: "10px" }} />
              <p style={{ color: "#64748b", fontFamily: "Exo 2, sans-serif", fontSize: ".875rem" }}>
                Select a message to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
