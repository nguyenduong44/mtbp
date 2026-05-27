# Refactor Admin — Checklist

## ✅ Đã hoàn thành (tự động)

| File                                   | Thay đổi                                                                |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `app/types.ts`                         | Xóa types cũ: ProcessRow, SponsorRow, WorkPortfolio, WorkCategory, v.v. |
| `app/services/uploadService.ts`        | Gộp thành `uploadFile(file, type)` + `deleteFile` + `deleteFiles`       |
| `app/routes/upload/api.upload.ts`      | **MỚI** — Unified upload handler (image/video trong 1 file)             |
| `app/routes/upload/api.delete-file.ts` | Thêm bảo vệ path traversal, clean code                                  |
| `app/services/projectService.ts`       | Batch insert, parallel upload, thêm `getBySlug`, `getPublicList`        |
| `app/routes.ts`                        | Xóa processes/settings/sponsors routes                                  |
| `app/layouts/AdminLayout.tsx`          | Xóa nav items: processes, sponsors, settings                            |
| `app/routes/admin._index.tsx`          | Xóa cards: processes, sponsors, settings                                |
| `app/hooks/useProjects.tsx`            | Fix queryKey, sync với service mới                                      |
| `CLEANUP_SQL.sql`                      | Script xóa tables không dùng trên Supabase                              |

---

## 🗑️ Cần xóa thủ công (dead code)

```
app/routes/admin.processes._index.tsx
app/routes/admin.processes.new.tsx
app/routes/admin.processes.$id.edit.tsx
app/routes/admin.settings._index.tsx
app/routes/admin.sponsors._index.tsx
app/routes/admin.sponsors.new.tsx
app/routes/admin.sponsors.$id.edit.tsx
app/services/processService.ts
app/services/settingService.ts
app/services/sponsorService.ts
app/hooks/useProcesses.ts
app/hooks/useSettings.ts
app/hooks/useSponsors.ts
app/components/admin/ProcessForm.tsx
app/components/admin/ProcessList.tsx
app/components/admin/SettingsForm.tsx
app/components/admin/SponsorForm.tsx
app/components/admin/SponsorList.tsx
app/routes/upload/api.upload-image.ts   ← thay bằng api.upload.ts
app/routes/upload/api.upload-video.ts   ← thay bằng api.upload.ts
```

---

## 🗄️ Chạy trên Supabase

Mở file `CLEANUP_SQL.sql` và chạy trong **Supabase > SQL Editor**.

---

## 🐳 Docker — Volume cho uploads

Thêm vào `docker-compose.yml` để không mất file khi restart container:

```yaml
services:
  app:
    volumes:
      - ./public/uploads:/app/public/uploads
```

Và thêm vào `.gitignore`:

```
public/uploads/images/
public/uploads/videos/
```

---

## 📋 Việc tiếp theo (public pages)

Sau khi admin xong, kết nối public pages với Supabase:

- `works.tsx` → dùng loader + `projectService.getPublicList(categorySlug)`
- `works.$slug.tsx` → dùng loader + `projectService.getBySlug(slug)`
- Xóa `app/data/portfolio.ts` sau khi chuyển xong
