"use client";
// src/app/admin/login/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 grid-bg"
      style={{ background: "linear-gradient(135deg, #020817 0%, #050f1e 100%)" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(34,211,238,.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center glow-cyan"
            style={{ background: "linear-gradient(135deg, #22d3ee, #0891b2)" }}
          >
            <Shield size={30} color="#020817" />
          </div>
          <h1
            className="text-2xl font-black mb-1"
            style={{ fontFamily: "Exo 2, sans-serif", color: "#f8fafc" }}
          >
            Admin Portal
          </h1>
          <p style={{ color: "#64748b", fontSize: ".875rem", fontFamily: "Exo 2, sans-serif" }}>
            Darshan Gawade — Portfolio CMS
          </p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2
            className="text-lg font-bold mb-6"
            style={{ color: "#22d3ee", fontFamily: "Exo 2, sans-serif" }}
          >
            Sign in to continue
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                  style={{ paddingLeft: "36px", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ padding: "13px 24px", fontSize: ".95rem", opacity: loading ? .7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4" style={{ color: "#64748b", fontSize: ".78rem", fontFamily: "Exo 2, sans-serif" }}>
            Protected by Firebase Authentication
          </p>
        </div>

        <div className="text-center mt-4">
          <a
            href="/"
            style={{ color: "#64748b", fontSize: ".82rem", fontFamily: "Exo 2, sans-serif", textDecoration: "none" }}
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
