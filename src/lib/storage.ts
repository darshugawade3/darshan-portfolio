
// src/lib/storage.ts — Cloudinary upload/delete helpers

export type UploadProgress = {
  progress: number;
  url?: string;
  error?: string;
};

// Upload file to Cloudinary through our Next.js API
export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (p: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("path", path);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const pct = Math.round(
          (event.loaded / event.total) * 100
        );
        onProgress?.(pct);
      }
    };

    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);

        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(result.error || "Upload failed"));
          return;
        }

        if (!result.url) {
          reject(new Error("Cloudinary URL missing"));
          return;
        }

        onProgress?.(100);
        resolve(result.url);
      } catch {
        reject(new Error("Invalid upload server response"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.onabort = () => {
      reject(new Error("Upload cancelled"));
    };

    xhr.send(formData);
  });
}

// Extract Cloudinary public ID and resource type from URL
function getCloudinaryAsset(url: string) {
  const parsed = new URL(url);

  if (parsed.hostname !== "res.cloudinary.com") {
    throw new Error("Not a Cloudinary URL");
  }

  const match = parsed.pathname.match(
    /\/(image|raw|video)\/upload\/(.+)$/
  );

  if (!match) {
    throw new Error("Invalid Cloudinary asset URL");
  }

  const resourceType = match[1];
  let publicId = match[2];

  // Remove version prefix, if present
  publicId = publicId.replace(/^v\d+\//, "");

  // Images and videos do not include the extension in public_id.
  // Raw assets, including PDFs and DOCX files, retain it.
  if (resourceType !== "raw") {
    publicId = publicId.replace(/\.[^/.]+$/, "");
  }

  return {
    public_id: publicId,
    resource_type: resourceType,
  };
}

// Delete Cloudinary file
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  const asset = getCloudinaryAsset(url);

  const response = await fetch("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asset),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Cloudinary delete failed");
  }
}

// Existing storage paths preserved for all Admin pages
export const storagePaths = {
  profile: () => "profile/photo",
  resume: (name: string) => `resume/${name}`,
  project: (id: string, name: string) =>
    `projects/${id}/${name}`,
  certificate: (id: string, name: string) =>
    `certificates/${id}/${name}`,
  gallery: (album: string, name: string) =>
    `gallery/${album}/${name}`,
  research: (id: string, name: string) =>
    `research/${id}/${name}`,
};

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Allowed file types
export const ALLOWED_TYPES = {
  image: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  document: [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  video: [
    "video/mp4",
    "video/webm",
    "video/ogg",
  ],
  all: [] as string[],
};

ALLOWED_TYPES.all = [
  ...ALLOWED_TYPES.image,
  ...ALLOWED_TYPES.document,
  ...ALLOWED_TYPES.video,
];
