// src/types/index.ts — Central type definitions

export interface Profile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  about: string;
  objective: string;
  photoURL: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter?: string;
  website?: string;
  resumeURL: string;
  resumeName: string;
  visitorCount?: number;
  downloadCount?: number;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institute: string;
  university: string;
  startYear: string;
  endYear: string;
  grade: string;
  achievements: string[];
  order: number;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0–100
  category: "programming" | "analytics" | "research" | "professional";
  icon?: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  color: "cyan" | "gold" | "purple" | "green";
  icon: string;
  featured: boolean;
  order: number;
  status: "completed" | "ongoing" | "planned";
  startDate: string;
  endDate?: string;
  objectives: string[];
  methodology: string;
  results: string;
  futureScope: string;
  technologies: string[];
  images: ProjectFile[];
  pdfReport?: ProjectFile;
  pptFile?: ProjectFile;
  videoURL?: string;
  githubURL?: string;
  liveURL?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  date: string;
  credentialId?: string;
  credentialURL?: string;
  imageURL?: string;
  pdfURL?: string;
  category: string;
  order: number;
  featured: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail?: string;
  caption: string;
  album: string;
  category: string;
  order: number;
  uploadedAt: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  description?: string;
  coverURL?: string;
  count: number;
  createdAt: string;
}

export interface ResearchWork {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  type: "paper" | "poster" | "presentation" | "report" | "publication";
  journal?: string;
  conference?: string;
  year: string;
  fileURL?: string;
  fileName?: string;
  fileType?: string;
  pptURL?: string;
  doi?: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
  ipAddress?: string;
}

export interface SiteStats {
  totalVisitors: number;
  totalDownloads: number;
  totalMessages: number;
  totalProjects: number;
  totalCertificates: number;
  totalResearch: number;
  lastUpdated: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  icon: string;
  order: number;
}
