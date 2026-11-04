"use client";
// src/components/portfolio/PortfolioClient.tsx — FIXED: proper scroll reveal, useEffect cleanup
import { useEffect } from "react";
import { profileService } from "@/lib/db";
import {
  useProfile, useEducation, useSkills, useProjects,
  useCertificates, useGallery, useResearch, useAchievements,
} from "@/hooks/usePortfolioData";
import ParticleBackground    from "./ParticleBackground";
import Navbar                from "./Navbar";
import HeroSection           from "./HeroSection";
import AboutSection          from "./AboutSection";
import EducationSection      from "./EducationSection";
import SkillsSection         from "./SkillsSection";
import ProjectsSection       from "./ProjectsSection";
import {
  CertificationsSection,
  ResearchSection,
  GallerySection,
  AchievementsSection,
  ContactSection,
  Footer,
} from "./PortfolioSections";

export default function PortfolioClient() {
  const { profile, loading: profileLoading } = useProfile();
  const { education }    = useEducation();
  const { skills }       = useSkills();
  const { projects }     = useProjects();
  const { certificates } = useCertificates();
  const { images, albums } = useGallery();
  const { research }     = useResearch();
  const { achievements } = useAchievements();

  // Visitor count — once per session
  useEffect(() => {
    const key = "dg_visited";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      profileService.incrementVisitor().catch(() => {});
    }
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (profileLoading) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 }
    );

    // Observe after a tick to ensure DOM is ready
    const tid = setTimeout(() => {
      document.querySelectorAll(".scroll-reveal").forEach((el) =>
        observer.observe(el)
      );
    }, 100);

    return () => {
      clearTimeout(tid);
      observer.disconnect();
    };
  }, [profileLoading]);

  if (profileLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020817",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"
            style={{ margin: "0 auto 16px" }}
          />
          <p
            style={{
              color: "#64748b",
              fontFamily: "Exo 2, sans-serif",
              fontSize: ".875rem",
            }}
          >
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#020817", minHeight: "100vh" }}>
      <ParticleBackground />
      <Navbar profile={profile} />
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <EducationSection education={education} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <CertificationsSection certificates={certificates} />
      <ResearchSection research={research} />
      <AchievementsSection achievements={achievements} />
      <GallerySection images={images} albums={albums} />
      <ContactSection profile={profile} />
      <Footer profile={profile} />

      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </div>
  );
}
