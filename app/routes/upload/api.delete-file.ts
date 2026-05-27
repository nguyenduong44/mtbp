// app/routes/upload/api.delete-file.ts
// Xóa file local trong thư mục public/uploads/
// Chỉ cho phép xóa file có URL bắt đầu bằng /uploads/ để tránh path traversal

import { unlink, access } from "fs/promises";
import path from "path";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let url: string;
  try {
    const body = await request.json();
    url = body?.url;
  } catch {
    return json({ success: false, error: "Body không hợp lệ" }, 400);
  }

  // Validate: chỉ cho phép xóa file trong /uploads/
  if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
    return json({ success: false, error: "URL không hợp lệ" }, 400);
  }

  // Chống path traversal: đảm bảo không có ".." trong URL
  if (url.includes("..")) {
    return json({ success: false, error: "URL không hợp lệ" }, 400);
  }

  const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));

  // Đảm bảo file nằm trong public/uploads/ (thêm lớp bảo vệ)
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  if (!filePath.startsWith(uploadsRoot)) {
    return json({ success: false, error: "Không được phép xóa file này" }, 403);
  }

  try {
    await access(filePath);
    await unlink(filePath);
    return json({ success: true });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // File không tồn tại = coi như đã xóa thành công
      return json({ success: true, message: "File không tồn tại trên disk" });
    }
    console.error("[delete-file] Lỗi xóa file:", filePath, err.message);
    return json({ success: false, error: err.message }, 500);
  }
}

// Helper nhỏ để trả JSON response gọn hơn
function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
