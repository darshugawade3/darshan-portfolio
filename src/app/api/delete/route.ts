import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { public_id } = await req.json();

    console.log("DELETE REQUEST:", public_id);

    if (!public_id) {
      return Response.json(
        { error: "public_id required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    return Response.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.log("DELETE ERROR:", err);

    return Response.json(
      {
        error: err.message || "Delete failed",
      },
      { status: 500 }
    );
  }
}