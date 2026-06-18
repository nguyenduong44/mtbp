CREATE TABLE clients (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL,
industry TEXT,
logo TEXT
);
CREATE TABLE projects (
id BIGSERIAL PRIMARY KEY,
slug TEXT UNIQUE NOT NULL,
category TEXT NOT NULL CHECK (category IN ('smm','branding','kol','production')),
thumbnail TEXT,
featured BOOLEAN DEFAULT false,
client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
overview TEXT,
scope TEXT[],
services_used TEXT[],
results TEXT[],
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE media_sections (
id BIGSERIAL PRIMARY KEY,
project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
title TEXT,
display_order INT DEFAULT 0
);
CREATE TABLE media_items (
id BIGSERIAL PRIMARY KEY,
section_id BIGINT REFERENCES media_sections(id) ON DELETE CASCADE,
type TEXT CHECK (type IN ('image','video')),
url TEXT NOT NULL,
caption TEXT,
display_order INT DEFAULT 0
);
CREATE TABLE social_links (
id BIGSERIAL PRIMARY KEY,
project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
platform TEXT CHECK (platform IN ('facebook','instagram','tiktok','youtube','other')),
url TEXT NOT NULL,
label TEXT
);
CREATE TABLE services (
id BIGSERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT NOT NULL,
bullets TEXT[],
icon_url TEXT,
lucide_icon_name TEXT,
display_order INT DEFAULT 0
);
CREATE TABLE processes (
id BIGSERIAL PRIMARY KEY,
step TEXT NOT NULL,
description TEXT NOT NULL,
display_order INT DEFAULT 0
);
CREATE TABLE sponsors (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL,
logo_url TEXT NOT NULL,
website_url TEXT,
display_order INT DEFAULT 0
);
CREATE TABLE contact_submissions (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL,
phone TEXT NOT NULL,
company TEXT,
service TEXT,
message TEXT NOT NULL,
status TEXT DEFAULT 'new' CHECK (status IN ('new','read','replied')),
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE site_settings (
key TEXT PRIMARY KEY,
value JSONB,
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Public read" ON storage.objects
FOR SELECT USING (bucket_id IN ('project-media','client-logos','service-icons'));

CREATE POLICY "Admin write" ON storage.objects
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read sponsors" ON storage.objects FOR SELECT USING (bucket_id = 'sponsors');
CREATE POLICY "Service role upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sponsors');

-- Cho phép authenticated users xem tất cả clients
CREATE POLICY "Enable read for authenticated users" ON clients
FOR SELECT USING (auth.role() = 'authenticated');

-- Cho phép authenticated users thêm client mới
CREATE POLICY "Enable insert for authenticated users" ON clients
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Cho phép authenticated users cập nhật client
CREATE POLICY "Enable update for authenticated users" ON clients
FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Cho phép authenticated users xóa client
CREATE POLICY "Enable delete for authenticated users" ON clients
FOR DELETE USING (auth.role() = 'authenticated');

-- Cho phép authenticated users toàn quyền (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Enable all for authenticated users" ON projects
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Cho phép public (không cần đăng nhập) chỉ được SELECT (xem dữ liệu)
CREATE POLICY "Enable read for public" ON projects
FOR SELECT USING (true);

-- media_sections
CREATE POLICY "Enable all for authenticated" ON media_sections
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON media_sections
FOR SELECT USING (true);

-- media_items
CREATE POLICY "Enable all for authenticated" ON media_items
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON media_items
FOR SELECT USING (true);

-- social_links
CREATE POLICY "Enable all for authenticated" ON social_links
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON social_links
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON clients;

CREATE POLICY "Enable all for authenticated" ON clients
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON clients
FOR SELECT USING (true);

ALTER TABLE projects
ADD COLUMN solution TEXT;

-- Thêm cột title (bắt buộc)
ALTER TABLE projects ADD COLUMN title TEXT NOT NULL DEFAULT '';

-- Tạo unique index cho slug (nếu chưa có)
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Bảng danh mục (VD: SMM, Branding, KOL, Production)
CREATE TABLE categories (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
slug TEXT NOT NULL UNIQUE,
description TEXT,
display_order INT DEFAULT 0
);

-- Bảng liên kết nhiều-nhiều
CREATE TABLE project_categories (
project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
PRIMARY KEY (project_id, category_id)
);

-- Xóa bảng services cũ nếu muốn (tuỳ chọn)
DROP TABLE IF EXISTS services CASCADE;

-- Thêm các cột mới cho categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS bullets TEXT[];
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS lucide_icon_name TEXT;

CREATE POLICY "Enable all for authenticated" ON categories
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON categories
FOR SELECT USING (true);

CREATE POLICY "Enable all for authenticated" ON project_categories
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON project_categories
FOR SELECT USING (true);

INSERT INTO categories (name, slug, description, bullets, icon_url, lucide_icon_name, display_order) VALUES
('Thiết kế thương hiệu', 'thiet-ke-thuong-hieu',
'Xây dựng bộ nhận diện hoàn chỉnh giúp thương hiệu nổi bật và đáng nhớ.',
ARRAY['Thiết kế logo', 'Brand guidelines', 'Stationery', 'Packaging', 'Bảng hiệu & ấn phẩm'],
'https://lottie.host/b1e97d42-72fd-4313-b647-d85a32f88bb3/cXHUJ4sV5X.lottie',
'Paintbrush', 1),

('Quản lý mạng xã hội', 'quan-ly-mang-xa-hoi',
'Xây chiến lược và tạo nội dung giúp thương hiệu xuất hiện nhất quán và hiệu quả trên các nền tảng.',
ARRAY['Chiến lược nội dung', 'Thiết kế & video ngắn', 'Quản lý fanpage', 'Chiến dịch truyền thông', 'Tối ưu hiệu suất'],
'https://lottie.host/ad0c7e1c-5c24-484c-a241-8b8a787d4ebe/0oJNLLzUsk.lottie',
'Activity', 2),

('Sản xuất nội dung trọn gói', 'san-xuat-noi-dung-tron-goi',
'Sản xuất nội dung đa dạng từ ý tưởng đến sản phẩm hoàn chỉnh, phù hợp mọi nền tảng.',
ARRAY['Kịch bản sáng tạo', 'Quay dựng chuyên nghiệp', 'Chụp ảnh concept', 'Hậu kỳ & chỉnh màu', 'Tối ưu định dạng'],
'https://lottie.host/bcbcbfd0-f800-442e-849e-8d53a9991f5b/qGjxILcN3P.lottie',
'Video', 3),

('Sản xuất TVC quy mô nhỏ', 'san-xuat-tvc-quy-mo-nho',
'Sản xuất TVC chuyên nghiệp với ngân sách tối ưu, phù hợp doanh nghiệp vừa và nhỏ.',
ARRAY['Kịch bản TVC', 'Quay phim chất lượng cao', 'Dựng phim chuyên nghiệp', 'Âm thanh & hiệu ứng', 'Phân phối đa nền tảng'],
'https://lottie.host/7cb906ec-d326-4e30-8fda-b27cdc9e2cb1/B9XWUctn1J.lottie',
'Clapperboard', 4),

('Tạo chiến dịch truyền thông', 'tao-chien-dich-truyen-thong',
'Lên ý tưởng và triển khai chiến dịch 360 độ, tối đa hóa nhận diện thương hiệu.',
ARRAY['Chiến lược sáng tạo', 'Kế hoạch đa kênh', 'Nội dung viral', 'Hợp tác KOL', 'Đo lường hiệu quả'],
'https://lottie.host/af0e7d1c-5c24-484c-a241-8b8a787d4ebe/0oJNLLzUsk.lottie',
'Megaphone', 5),

('Chụp ảnh xóa phông', 'chup-anh-xoa-phong',
'Dịch vụ chụp ảnh sản phẩm xóa phông chuyên nghiệp, nâng tầm hình ảnh thương hiệu.',
ARRAY['Chụp sản phẩm', 'Xóa phông tinh xảo', 'Chỉnh màu đồng bộ', 'Tối ưu cho web', 'Giao hàng nhanh'],
'https://lottie.host/af0e7d1c-5c24-484c-a241-8b8a787d4ebe/0oJNLLzUsk.lottie',
'Camera', 6),

('Chụp ảnh concept F&B', 'chup-anh-concept-fb',
'Tạo bộ ảnh concept độc đáo cho nhà hàng, quán cà phê, thu hút thực khách.',
ARRAY['Xây dựng concept', 'Styling món ăn', 'Chụp không gian', 'Chỉnh sáng tạo', 'Kho ảnh đa dạng'],
'https://lottie.host/af0e7d1c-5c24-484c-a241-8b8a787d4ebe/0oJNLLzUsk.lottie',
'Coffee', 7);

-- Xoá cột category (vì không còn dùng)
ALTER TABLE projects DROP COLUMN IF EXISTS category;

-- Xoá cột services_used (vì thay bằng categories)
ALTER TABLE projects DROP COLUMN IF EXISTS services_used;

CREATE INDEX idx_projects_client_id
ON projects(client_id);

CREATE INDEX idx_media_sections_project_id
ON media_sections(project_id);

CREATE INDEX idx_media_items_section_id
ON media_items(section_id);

CREATE INDEX idx_social_links_project_id
ON social_links(project_id);

CREATE INDEX idx_project_categories_project_id
ON project_categories(project_id);

CREATE INDEX idx_project_categories_category_id
ON project_categories(category_id);

CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_categories_display_order ON categories(display_order);

DROP TABLE IF EXISTS processes CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

CREATE INDEX IF NOT EXISTS idx_projects_title
ON projects(title);

CREATE INDEX IF NOT EXISTS idx_projects_slug
ON projects(slug);

CREATE INDEX IF NOT EXISTS idx_projects_created_at
ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_featured
ON projects(featured);

CREATE INDEX IF NOT EXISTS idx_projects_client_id
ON projects(client_id);

CREATE INDEX IF NOT EXISTS idx_clients_name
ON clients(name);

CREATE INDEX IF NOT EXISTS idx_clients_industry
ON clients(industry);

CREATE INDEX IF NOT EXISTS idx_categories_name
ON categories(name);

CREATE INDEX IF NOT EXISTS idx_categories_slug
ON categories(slug);

CREATE INDEX IF NOT EXISTS idx_project_categories_project
ON project_categories(project_id);

CREATE INDEX IF NOT EXISTS idx_project_categories_category
ON project_categories(category_id);

-- 1. Xóa ràng buộc cũ
ALTER TABLE projects DROP CONSTRAINT projects_client_id_fkey;

-- 2. Thêm ràng buộc mới với ON DELETE SET NULL
ALTER TABLE projects ADD CONSTRAINT projects_client_id_fkey
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

SELECT
conname,
confdeltype
FROM pg_constraint
WHERE conname = 'projects_client_id_fkey';

-- Tạo bảng industries
CREATE TABLE industries (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
slug TEXT NOT NULL UNIQUE,
description TEXT,
display_order INT DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thêm cột industry_id vào clients, xóa cột industry cũ
ALTER TABLE clients ADD COLUMN industry_id BIGINT REFERENCES industries(id) ON DELETE SET NULL;
ALTER TABLE clients DROP COLUMN industry;

-- Index cho industries
CREATE INDEX idx_industries_name ON industries(name);
CREATE INDEX idx_industries_slug ON industries(slug);
CREATE INDEX idx_industries_display_order ON industries(display_order);
CREATE INDEX idx_clients_industry_id ON clients(industry_id);

-- RLS cho industries
CREATE POLICY "Enable all for authenticated" ON industries
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON industries
FOR SELECT USING (true);

-- Cập nhật RLS cho clients (đã có)
-- Cập nhật RLS cho projects (giữ nguyên, thêm cột solution không ảnh hưởng)

-- ============================================================
-- Bảng lookup: Loại hình kinh doanh
-- ============================================================
CREATE TABLE IF NOT EXISTS business_types (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
slug TEXT NOT NULL UNIQUE,
display_order INT DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Bảng lookup: Gói dịch vụ
-- ============================================================
CREATE TABLE IF NOT EXISTS service_packages (
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
slug TEXT NOT NULL UNIQUE,
description TEXT,
monthly_price NUMERIC(12,2) DEFAULT 0,
display_order INT DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Mở rộng bảng clients (thêm cột)
-- ============================================================
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS business_type_id BIGINT REFERENCES business_types(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS package_id BIGINT REFERENCES service_packages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS monthly_cost NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS contract_start_date DATE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS assigned_to TEXT,
ADD COLUMN IF NOT EXISTS added_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- Bảng tasks (Kanban)
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
id BIGSERIAL PRIMARY KEY,
client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
title TEXT NOT NULL,
description TEXT,
deadline DATE,
assigned_to TEXT,
priority TEXT CHECK (priority IN ('high','medium','low')) DEFAULT 'medium',
status TEXT CHECK (status IN ('todo','doing','done')) DEFAULT 'todo',
sort_order INT DEFAULT 0,
completed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_clients_business_type ON clients(business_type_id);
CREATE INDEX idx_clients_package ON clients(package_id);

-- ============================================================
-- Triggers: tự động cập nhật updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- Trigger: tự động ghi completed_at khi task chuyển sang 'done'
-- ============================================================
CREATE OR REPLACE FUNCTION fn_task_completed_at()
RETURNS TRIGGER AS
$$

BEGIN
IF NEW.status = 'done' AND OLD.status != 'done' THEN
NEW.completed_at = NOW();
ELSIF NEW.status != 'done' THEN
NEW.completed_at = NULL;
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_completed_at
  BEFORE UPDATE OF status ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION fn_task_completed_at();

-- ============================================================
-- RLS Policies
-- ============================================================
-- Business types
CREATE POLICY "Enable all for authenticated" ON business_types
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON business_types
  FOR SELECT USING (true);

-- Service packages
CREATE POLICY "Enable all for authenticated" ON service_packages
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON service_packages
  FOR SELECT USING (true);

-- Clients (đã có policy, chỉ cần thêm cho các cột mới – không cần thay đổi vì policy dùng ALL)
-- Tasks
CREATE POLICY "Enable all for authenticated" ON tasks
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for public" ON tasks
  FOR SELECT USING (true);

-- ============================================================
-- Seed dữ liệu mẫu (tuỳ chọn)
-- ============================================================
INSERT INTO business_types (name, slug, display_order) VALUES
  ('F&B (Ẩm thực)', 'fb', 1),
  ('Spa & Wellness', 'spa', 2),
  ('Retail (Bán lẻ)', 'retail', 3),
  ('Thời trang', 'thoi-trang', 4),
  ('Làm đẹp', 'lam-dep', 5),
  ('Bất động sản', 'bat-dong-san', 6),
  ('Giáo dục', 'giao-duc', 7),
  ('Y tế & Sức khỏe', 'yte', 8),
  ('Khách sạn & Du lịch', 'khach-san', 9),
  ('Khác', 'khac', 10)
ON CONFLICT (name) DO NOTHING;

INSERT INTO service_packages (name, slug, description, monthly_price, display_order) VALUES
  ('Cơ bản', 'co-ban', 'Gói cơ bản', 5000000, 1),
  ('Tiêu chuẩn', 'tieu-chuan', 'Gói tiêu chuẩn', 10000000, 2),
  ('Cao cấp', 'cao-cap', 'Gói cao cấp', 20000000, 3),
  ('TikTok Basic', 'tiktok-basic', 'Quản lý TikTok cơ bản', 8000000, 4),
  ('TikTok Pro', 'tiktok-pro', 'Quản lý TikTok nâng cao', 15000000, 5),
  ('Content Full', 'content-full', 'Trọn gói nội dung', 18000000, 6),
  ('Social Media', 'social-media', 'Quản lý mạng xã hội toàn diện', 12000000, 7),
  ('Tùy chỉnh', 'tuy-chinh', 'Gói tùy chỉnh', 0, 99)
ON CONFLICT (name) DO NOTHING;
$$
