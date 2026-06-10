// app/routes/upload/api.upload.ts
// Unified upload handler: ?type=image | video
// - image → sharp → WebP, lưu vào public/uploads/images/
// - video → ffmpeg → MP4, lưu vào public/uploads/videos/

import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import type { ActionFunctionArgs } from "react-router";

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function safeName(originalName: string, ext: string): string {
  const base = path.basename(originalName, path.extname(originalName));
  const slug = base.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return `${Date.now()}-${slug}${ext}`;
}

async function processImage(file: File, uploadDir: string): Promise<string> {
  const fileName = safeName(file.name, ".webp");
  const tempPath = path.join(uploadDir, `temp-${fileName}`);
  const finalPath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(tempPath, buffer);

  try {
    await sharp(tempPath).webp({ quality: 82 }).toFile(finalPath);
  } finally {
    await unlink(tempPath).catch(() => {});
  }

  return `/uploads/images/${fileName}`;
}

function processVideo(tempPath: string, finalPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(tempPath)
      .outputOptions([
        "-c:v libx264",
        "-b:v 1M",
        "-vf scale=1280:-2",
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart",
      ])
      .output(finalPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}

async function handleVideoUpload(
  file: File,
  uploadDir: string,
): Promise<string> {
  const fileName = safeName(file.name, ".mp4");
  const tempPath = path.join(uploadDir, `temp-${fileName}`);
  const finalPath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(tempPath, buffer);

  console.log("UPLOADS_ROOT:", process.env.UPLOADS_ROOT);
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
  try {
    await processVideo(tempPath, finalPath);
  } finally {
    await unlink(tempPath).catch(() => {});
  }

  return `/uploads/videos/${fileName}`;
}

// ----------------------------------------------------------------
// Action handler
// ----------------------------------------------------------------

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type"); // "image" | "video"

  if (type !== "image" && type !== "video") {
    return new Response("Query param ?type= phải là 'image' hoặc 'video'", {
      status: 400,
    });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("Không tìm thấy file trong request", { status: 400 });
  }

  if (type === "image" && !file.type.startsWith("image/")) {
    return new Response("Chỉ chấp nhận file ảnh", { status: 400 });
  }

  if (type === "video" && !file.type.startsWith("video/")) {
    return new Response("Chỉ chấp nhận file video", { status: 400 });
  }

  const UPLOADS_ROOT =
    process.env.UPLOADS_ROOT || path.join(process.cwd(), "public", "uploads");

  const subDir = type === "image" ? "images" : "videos";
  const uploadDir = path.join(UPLOADS_ROOT, subDir);
  await mkdir(uploadDir, { recursive: true });

  try {
    const publicUrl =
      type === "image"
        ? await processImage(file, uploadDir)
        : await handleVideoUpload(file, uploadDir);

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(`[upload/${type}] Lỗi xử lý file:`, err);
    return new Response(`Xử lý file thất bại: ${err.message}`, { status: 500 });
  }
}
