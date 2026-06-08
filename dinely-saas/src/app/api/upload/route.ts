import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST /api/upload
// Accepts: multipart/form-data with a "file" field (image).
// Returns: { url: string } — the uploaded image URL.
//
// Uses Cloudinary unsigned upload. Set CLOUDINARY_CLOUD_NAME and
// CLOUDINARY_UPLOAD_PRESET in .env.local (create a free account at cloudinary.com).

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return NextResponse.json(
      {
        error:
          "Image upload is not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to .env.local",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 5 MB" },
        { status: 413 },
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, or GIF images are allowed" },
        { status: 415 },
      );
    }

    // Forward to Cloudinary
    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("upload_preset", uploadPreset);
    cloudForm.append("folder", "dinely");

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudForm },
    );

    if (!cloudRes.ok) {
      const err = await cloudRes.text();
      console.error("[POST /api/upload] Cloudinary error:", err);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const data = (await cloudRes.json()) as { secure_url: string };
    return NextResponse.json({ url: data.secure_url }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
