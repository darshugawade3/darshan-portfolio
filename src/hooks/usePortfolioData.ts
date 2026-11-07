// src/hooks/usePortfolioData.ts — FIXED: stable callbacks, proper cleanup
"use client";
import { useEffect, useState, useCallback } from "react";
import {
  profileService, educationService, skillsService, projectsService,
  certificatesService, galleryService, researchService, achievementsService,
} from "@/lib/db";
import type {
  Profile, Education, Skill, Project, Certificate,
  GalleryImage, GalleryAlbum, ResearchWork, Achievement,
} from "@/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time subscription via onSnapshot
    const unsub = profileService.subscribe((p) => {
      setProfile(p);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { profile, loading };
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await educationService.getAll();
      setEducation(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { education, loading, refresh: load };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await skillsService.getAll();
      setSkills(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { skills, loading, refresh: load };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectsService.getAll();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { projects, loading, refresh: load };
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await certificatesService.getAll();
      setCertificates(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { certificates, loading, refresh: load };
}

export function useGallery(album?: string) {
  const [images, setImages]   = useState<GalleryImage[]>([]);
  const [albums, setAlbums]   = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [imgs, albs] = await Promise.all([
        galleryService.getImages(album),
        galleryService.getAlbums(),
      ]);
      setImages(imgs);
      setAlbums(albs);
    } finally {
      setLoading(false);
    }
  }, [album]);

  useEffect(() => { load(); }, [load]);

  return { images, albums, loading, refresh: load };
}

export function useResearch() {
  const [research, setResearch] = useState<ResearchWork[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await researchService.getAll();
      setResearch(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { research, loading, refresh: load };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await achievementsService.getAll();
      setAchievements(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { achievements, loading, refresh: load };
}
