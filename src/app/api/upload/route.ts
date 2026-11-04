import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawFile = formData.get("file");
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

    const folder =
      typeof rawFolder === "string" && rawFolder.length > 0
        ? rawFolder
        : "profile";

    const buffer = Buffer.from(await file.arrayBuffer());

    // PDF => raw, Images => image
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const resourceType = isPdf ? "raw" : "image";

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
  folder,
  resource_type: resourceType,

  public_id: file.name,
  use_filename: true,
  unique_filename: false,
  overwrite: true,
},
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    console.log("FILE:", file.name);
    console.log("TYPE:", file.type);
    console.log("RESOURCE TYPE:", result.resource_type);
    console.log("SECURE URL:", result.secure_url);
    console.log("PUBLIC ID:", result.public_id);
    console.log("FORMAT:", result.format);

    return Response.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      original_filename: result.original_filename,
    });
  } catch (err: any) {
    console.log("UPLOAD ERROR:", err);

    return Response.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}