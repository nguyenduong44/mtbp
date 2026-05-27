// app/services/uploadService.ts
// Giao tiếp với API server để upload/xóa file local

type UploadType = "image" | "video";

export const uploadService = {
  /**
   * Upload một file lên server.
   * - image → convert sang WebP, lưu vào public/uploads/images/
   * - video → convert sang MP4, lưu vào public/uploads/videos/
   * Trả về URL public dạng /uploads/images/xxx.webp
   */
  uploadFile: async (file: File, type: UploadType): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/upload?type=${type}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Upload ${type} thất bại: ${text}`);
    }

    const { url } = await res.json();
    return url as string;
  },

  /**
   * Alias cho uploadFile('image')
   */
  uploadImage: async (file: File): Promise<string> => {
    return uploadService.uploadFile(file, "image");
  },

  /**
   * Alias cho uploadFile('video')
   */
  uploadVideo: async (file: File): Promise<string> => {
    return uploadService.uploadFile(file, "video");
  },

  /**
   * Xóa một file local.
   * Chỉ xóa nếu URL bắt đầu bằng /uploads/ (file local).
   * URL ngoài (YouTube, v.v.) sẽ bị bỏ qua hoàn toàn.
   */
  deleteFile: async (url: string): Promise<void> => {
    if (!url || !url.startsWith("/uploads/")) return;

    try {
      const res = await fetch("/api/delete-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Xóa file thất bại:", data);
      }
    } catch (err) {
      // Không throw để tránh block flow chính khi file không tồn tại
      console.error("Lỗi kết nối khi xóa file:", err);
    }
  },

  /**
   * Xóa nhiều files cùng lúc (song song).
   */
  deleteFiles: async (urls: string[]): Promise<void> => {
    const localUrls = urls.filter((u) => u && u.startsWith("/uploads/"));
    if (localUrls.length === 0) return;
    await Promise.all(localUrls.map((url) => uploadService.deleteFile(url)));
  },
};
