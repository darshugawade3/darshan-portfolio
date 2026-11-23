
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { public_id, resource_type } = await req.json();

    if (
      typeof public_id !== "string" ||
      !public_id.trim() ||
      !["image", "raw", "video"].includes(resource_type)
    ) {
      return Response.json(
        { error: "Valid public_id and resource_type required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(
      public_id,
      {
        resource_type,
        type: "upload",
        invalidate: true,
      }
    );

    if (result.result !== "ok" && result.result !== "not found") {
      return Response.json(
        { error: "Cloudinary could not delete this file" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      result: result.result,
    });
  } catch (err: any) {
    console.error("CLOUDINARY DELETE ERROR:", err);

    return Response.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
