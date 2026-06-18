// ============================================================
// DATABASE ROW TYPES — khớp 100% với schema Supabase hiện tại
// ============================================================

export type ClientRow = {
  id: number;
  name: string;
  industry_id: number | null;
  logo: string | null;
  business_type_id: number | null;
  package_id: number | null;
  contact_person: string | null;
  phone: string | null;
  monthly_cost: number | null;
  contract_start_date: string | null;
  notes: string | null;
  assigned_to: string | null;
  added_at: string;
  updated_at: string;
  // join fields
  business_types?: BusinessType;
  service_packages?: ServicePackage;
};

export type IndustryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
};

export type ProjectRow = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  featured: boolean;
  client_id: number | null;
  overview: string | null;
  solution: string | null;
  scope: string[] | null;
  results: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  bullets: string[] | null;
  icon_url: string | null;
  lucide_icon_name: string | null;
  display_order: number;
};

export type MediaSectionRow = {
  id: number;
  project_id: number;
  title: string | null;
  display_order: number;
};

export type MediaItemRow = {
  id: number;
  section_id: number;
  type: "image" | "video";
  url: string;
  caption: string | null;
  display_order: number;
};

export type SocialLinkRow = {
  id: number;
  project_id: number;
  platform: "facebook" | "instagram" | "tiktok" | "youtube" | "other";
  url: string;
  label: string | null;
};

export type ContactSubmissionRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string | null;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
};

// ============================================================
// JOIN TYPES — dùng trong queries có nhiều bảng
// ============================================================

// Dùng trong danh sách projects (admin list)
export type ProjectWithClient = ProjectRow & {
  clients: { name: string } | null;
};

// Dùng trong trang chi tiết project (admin edit + public detail)
export type ProjectWithDetails = ProjectRow & {
  clients: {
    name: string;
    logo: string | null;
    industry_id: number | null;
    industries?: { name: string } | null;
  } | null;
  categories: Category[];
  media_sections: (MediaSectionRow & { media_items: MediaItemRow[] })[];
  social_links: SocialLinkRow[];
};

// ============================================================
// FORM / UI TYPES
// ============================================================

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export type SubmissionStatus = "idle" | "error" | "submitting" | "success";

export type NavItem = {
  label: string;
  href: string;
};

// ============================================================
// Bảng lookup: Loại hình kinh doanh
// ============================================================
export type BusinessType = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
};

// ============================================================
// Bảng lookup: Gói dịch vụ
// ============================================================
export type ServicePackage = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  monthly_price: number;
  display_order: number;
  created_at: string;
};

// ============================================================
// Bảng tasks (Kanban)
// ============================================================
export type TaskRow = {
  id: number;
  client_id: number;
  title: string;
  description: string | null;
  deadline: string | null;
  assigned_to: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "doing" | "done";
  sort_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientWithTasks = ClientRow & {
  tasks: TaskRow[];
};

export type ClientFormData = {
  name: string;
  business_type_id: number | null;
  package_id: number | null;
  contact_person: string | null;
  phone: string | null;
  monthly_cost: number | null;
  contract_start_date: string | null;
  notes: string | null;
  assigned_to: string | null;
};

export type TaskFormData = {
  title: string;
  description: string | null;
  deadline: string | null;
  assigned_to: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "doing" | "done";
};
