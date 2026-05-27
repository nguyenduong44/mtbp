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
