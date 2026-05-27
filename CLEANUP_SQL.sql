-- ================================================================
-- CLEANUP SCRIPT — chạy trên Supabase SQL Editor
-- Xóa các bảng không còn dùng sau khi đã set cứng trong code
-- ================================================================

-- Xóa bảng processes (đã set cứng trong app/data/processes.ts)
DROP TABLE IF EXISTS processes CASCADE;

-- Xóa bảng site_settings (đã set cứng trực tiếp trong code)
DROP TABLE IF EXISTS site_settings CASCADE;

-- Xóa bảng sponsors (đã set cứng trong app/data/sponsorsImage.ts)
-- Bỏ comment dòng dưới nếu bạn muốn xóa luôn sponsors
-- DROP TABLE IF EXISTS sponsors CASCADE;

-- ================================================================
-- VERIFY — kiểm tra các bảng còn lại
-- ================================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Kết quả mong đợi:
-- categories
-- clients
-- contact_submissions
-- media_items
-- media_sections
-- project_categories
-- projects
-- social_links
-- sponsors (nếu chưa xóa)
