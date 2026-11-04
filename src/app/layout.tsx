// src/app/layout.tsx
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darshan Suresh Gawade | B.Pharm | Healthcare Data Analyst",
  description:
    "Portfolio of Darshan Suresh Gawade — B.Pharm Student, Pharmaceutical Researcher, Healthcare Data Analyst. Skilled in Python, Power BI, Oracle SQL, Phytochemical Research.",
  keywords: [
    "Darshan Gawade", "B.Pharm", "Pharmaceutical Research", "Healthcare Analytics",
    "Power BI", "Python", "Phytochemistry", "DBATU", "Dhule",
  ],
  authors: [{ name: "Darshan Suresh Gawade" }],
  openGraph: {
    title: "Darshan Suresh Gawade | Portfolio",
    description: "B.Pharm Student | Pharmaceutical Researcher | Healthcare Data Analyst",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0a1628",
                color: "#f8fafc",
                border: "1px solid rgba(34,211,238,0.2)",
                fontFamily: "Exo 2, sans-serif",
              },
              success: { iconTheme: { primary: "#22d3ee", secondary: "#020817" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
