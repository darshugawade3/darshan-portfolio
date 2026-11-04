// src/lib/storage.ts — Firebase Storage upload/delete helpers

import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
  listAll, UploadTask,
} from "firebase/storage";
import { storage } from "./firebase";

export type UploadProgress = {
  progress: number;
  url?: string;
  error?: string;
};

// Generic file uploader with progress callback
export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (p: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task: UploadTask = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(pct);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // File may already be deleted — ignore
  }
}

// Storage path helpers
export const storagePaths = {
  profile: () => `profile/photo`,
  resume: (name: string) => `resume/${name}`,
  project: (id: string, name: string) => `projects/${id}/${name}`,
  certificate: (id: string, name: string) => `certificates/${id}/${name}`,
  gallery: (album: string, name: string) => `gallery/${album}/${name}`,
  research: (id: string, name: string) => `research/${id}/${name}`,
};

// List all files in a path
export async function listFiles(path: string) {
  const listRef = ref(storage, path);
  const result = await listAll(listRef);
  return Promise.all(
    result.items.map(async (item) => ({
      name: item.name,
      fullPath: item.fullPath,
      url: await getDownloadURL(item),
    }))
  );
}

// Get file size display
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Allowed file types
export const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  document: [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  video: ["video/mp4", "video/webm", "video/ogg"],
  all: [] as string[],
};
ALLOWED_TYPES.all = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document, ...ALLOWED_TYPES.video];
