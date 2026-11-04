// src/lib/db.ts — Firestore service layer

import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
  deleteDoc, query, orderBy, where, limit, increment, onSnapshot,
  serverTimestamp, Timestamp, writeBatch, QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Profile, Education, Skill, Project, Certificate,
  GalleryImage, GalleryAlbum, ResearchWork, ContactMessage,
  SiteStats, Achievement,
} from "@/types";

// ──────────── PROFILE ────────────
export const profileService = {
  async get(): Promise<Profile | null> {
    const snap = await getDoc(doc(db, "config", "profile"));
    return snap.exists() ? (snap.data() as Profile) : null;
  },
  async set(data: Partial<Profile>): Promise<void> {
    await setDoc(doc(db, "config", "profile"), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  },
  async incrementVisitor(): Promise<void> {
    await updateDoc(doc(db, "config", "profile"), { visitorCount: increment(1) });
  },
  async incrementDownload(): Promise<void> {
    await updateDoc(doc(db, "config", "profile"), { downloadCount: increment(1) });
  },
  subscribe(cb: (p: Profile | null) => void) {
    return onSnapshot(doc(db, "config", "profile"), (snap) => {
      cb(snap.exists() ? (snap.data() as Profile) : null);
    });
  },
};

// ──────────── EDUCATION ────────────
export const educationService = {
  async getAll(): Promise<Education[]> {
    const q = query(collection(db, "education"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Education));
  },
  async add(data: Omit<Education, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "education"), data);
    return ref.id;
  },
  async update(id: string, data: Partial<Education>): Promise<void> {
    await updateDoc(doc(db, "education", id), data);
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "education", id));
  },
};

// ──────────── SKILLS ────────────
export const skillsService = {
  async getAll(): Promise<Skill[]> {
    const q = query(collection(db, "skills"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill));
  },
  async add(data: Omit<Skill, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "skills"), data);
    return ref.id;
  },
  async update(id: string, data: Partial<Skill>): Promise<void> {
    await updateDoc(doc(db, "skills", id), data);
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "skills", id));
  },
};

// ──────────── PROJECTS ────────────
export const projectsService = {
  async getAll(): Promise<Project[]> {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  },
  async getFeatured(): Promise<Project[]> {
    const q = query(collection(db, "projects"), where("featured", "==", true), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  },
  async getById(id: string): Promise<Project | null> {
    const snap = await getDoc(doc(db, "projects", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
  },
  async add(data: Omit<Project, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "projects"), { ...data, viewCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return ref.id;
  },
  async update(id: string, data: Partial<Project>): Promise<void> {
    await updateDoc(doc(db, "projects", id), { ...data, updatedAt: new Date().toISOString() });
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "projects", id));
  },
  async incrementView(id: string): Promise<void> {
    await updateDoc(doc(db, "projects", id), { viewCount: increment(1) });
  },
};

// ──────────── CERTIFICATES ────────────
export const certificatesService = {
  async getAll(): Promise<Certificate[]> {
    const q = query(collection(db, "certificates"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certificate));
  },
  async add(data: Omit<Certificate, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "certificates"), data);
    return ref.id;
  },
  async update(id: string, data: Partial<Certificate>): Promise<void> {
    await updateDoc(doc(db, "certificates", id), data);
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "certificates", id));
  },
};

// ──────────── GALLERY ────────────
export const galleryService = {
  async getImages(album?: string): Promise<GalleryImage[]> {
    const constraints: QueryConstraint[] = [orderBy("order", "asc")];
    if (album) constraints.unshift(where("album", "==", album));
    const q = query(collection(db, "gallery"), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage));
  },
  async getAlbums(): Promise<GalleryAlbum[]> {
    const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryAlbum));
  },
  async addImage(data: Omit<GalleryImage, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "gallery"), data);
    return ref.id;
  },
  async addAlbum(data: Omit<GalleryAlbum, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "gallery_albums"), data);
    return ref.id;
  },
  async deleteImage(id: string): Promise<void> {
    await deleteDoc(doc(db, "gallery", id));
  },
  async updateAlbum(id: string, data: Partial<GalleryAlbum>): Promise<void> {
    await updateDoc(doc(db, "gallery_albums", id), data);
  },
  async deleteAlbum(id: string): Promise<void> {
    // Delete all images in album first
    const images = await this.getImages(id);
    const batch = writeBatch(db);
    images.forEach((img) => batch.delete(doc(db, "gallery", img.id)));
    batch.delete(doc(db, "gallery_albums", id));
    await batch.commit();
  },
};

// ──────────── RESEARCH ────────────
export const researchService = {
  async getAll(): Promise<ResearchWork[]> {
    const q = query(collection(db, "research"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ResearchWork));
  },
  async add(data: Omit<ResearchWork, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "research"), data);
    return ref.id;
  },
  async update(id: string, data: Partial<ResearchWork>): Promise<void> {
    await updateDoc(doc(db, "research", id), data);
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "research", id));
  },
};

// ──────────── CONTACT MESSAGES ────────────
export const messagesService = {
  async getAll(): Promise<ContactMessage[]> {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
  },
  async getUnread(): Promise<ContactMessage[]> {
    const q = query(collection(db, "messages"), where("read", "==", false), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
  },
  async add(data: Omit<ContactMessage, "id" | "read" | "replied">): Promise<string> {
    const ref = await addDoc(collection(db, "messages"), { ...data, read: false, replied: false });
    return ref.id;
  },
  async markRead(id: string): Promise<void> {
    await updateDoc(doc(db, "messages", id), { read: true });
  },
  async markReplied(id: string): Promise<void> {
    await updateDoc(doc(db, "messages", id), { replied: true });
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "messages", id));
  },
  subscribeUnreadCount(cb: (count: number) => void) {
    const q = query(collection(db, "messages"), where("read", "==", false));
    return onSnapshot(q, (snap) => cb(snap.size));
  },
};

// ──────────── ACHIEVEMENTS ────────────
export const achievementsService = {
  async getAll(): Promise<Achievement[]> {
    const q = query(collection(db, "achievements"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement));
  },
  async add(data: Omit<Achievement, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "achievements"), data);
    return ref.id;
  },
  async update(id: string, data: Partial<Achievement>): Promise<void> {
    await updateDoc(doc(db, "achievements", id), data);
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "achievements", id));
  },
};

// ──────────── STATS ────────────
export const statsService = {
  async get(): Promise<SiteStats | null> {
    const snap = await getDoc(doc(db, "config", "stats"));
    return snap.exists() ? (snap.data() as SiteStats) : null;
  },
  async update(data: Partial<SiteStats>): Promise<void> {
    await setDoc(doc(db, "config", "stats"), { ...data, lastUpdated: new Date().toISOString() }, { merge: true });
  },
};
