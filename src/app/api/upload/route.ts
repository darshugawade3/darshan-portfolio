
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary environment variables missing");
    }

    const formData = await req.formData();

    const rawFile = formData.get("file");
    const rawPath = formData.get("path");
    const rawFolder = formData.get("folder");

    if (
      !rawFile ||
      typeof (rawFile as any).arrayBuffer !== "function"
    ) {
      return Response.json(
        { error: "Invalid file upload" },
        { status: 400 }
      );
    }

    const file = rawFile as File;

    const folderValue =
      typeof rawPath === "string" && rawPath.trim()
        ? rawPath
        : typeof rawFolder === "string" && rawFolder.trim()
          ? rawFolder
          : "profile";

    const folder = folderValue
      .replace(/\\/g, "/")
      .split("/")
      .filter(Boolean)
      .map(part => part.replace(/[^a-zA-Z0-9_-]/g, "_"))
      .join("/");

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const resourceType = isImage
      ? "image"
      : isVideo
        ? "video"
        : "raw";

    const buffer = Buffer.from(await file.arrayBuffer());

    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100);

    const publicId =
      resourceType === "raw"
        ? `${safeName || "file"}_${Date.now()}${file.name.match(/\.[^/.]+$/)?.[0] || ""}`
        : `${safeName || "file"}_${Date.now()}`;

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: publicId,
          overwrite: false,
        },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        }
      );

      stream.end(buffer);
    });

    return Response.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      original_filename: result.original_filename,
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);

    return Response.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
