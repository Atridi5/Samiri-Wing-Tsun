import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "samir-wing-tsun" },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error ?? new Error("upload_failed"));
        resolve({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
      }
    );
    uploadStream.end(buffer);
  }).catch(() => null);

  if (!result) {
    return NextResponse.json({ error: "upload_failed" }, { status: 502 });
  }

  return NextResponse.json({ url: result.secure_url, publicId: result.public_id }, { status: 201 });
}
