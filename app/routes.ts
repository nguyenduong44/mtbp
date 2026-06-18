import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // ----------------------------------------------------------------
  // Public routes
  // ----------------------------------------------------------------
  layout("./layouts/MainLayout.tsx", [
    index("./routes/home.tsx"),
    route("du-an", "./routes/works.tsx"),
    route("du-an/:slug", "./routes/works.$slug.tsx"),
    route("ve-chung-toi", "./routes/about.tsx"),
    route("lien-he", "./routes/contact.tsx"),
    route("giai-phap", "./routes/solution.tsx"),
    route("tuyen-dung", "./routes/career.tsx"),
  ]),

  // ----------------------------------------------------------------
  // Auth
  // ----------------------------------------------------------------
  route("admin/login", "./routes/admin.login.tsx"),

  // ----------------------------------------------------------------
  // Admin routes (yêu cầu đăng nhập — xử lý trong AdminLayout)
  // ----------------------------------------------------------------
  layout("./layouts/AdminLayout.tsx", [
    route("admin", "./routes/admin._index.tsx"),
    route("admin/projects", "./routes/admin.projects._index.tsx"),
    route("admin/projects/new", "./routes/admin.projects.new.tsx"),
    route("admin/projects/:id/edit", "./routes/admin.projects.$id.edit.tsx"),
    route("admin/clients", "./routes/admin.clients._index.tsx"),
    route("admin/clients/new", "./routes/admin.clients.new.tsx"),
    route("admin/clients/:id/edit", "./routes/admin.clients.$id.edit.tsx"),
    route("admin/categories", "./routes/admin.categories._index.tsx"),
    route("admin/categories/new", "./routes/admin.categories.new.tsx"),
    route("admin/industries", "./routes/admin.industries._index.tsx"),
    route("admin/industries/new", "./routes/admin.industries.new.tsx"),
    route(
      "admin/industries/:id/edit",
      "./routes/admin.industries.$id.edit.tsx",
    ),
    route(
      "admin/categories/:id/edit",
      "./routes/admin.categories.$id.edit.tsx",
    ),
    route("admin/contacts", "./routes/admin.contacts._index.tsx"),
  ]),

  // --- CRM SECTION (DEDICATED LAYOUT) ---
  layout("./layouts/CrmLayout.tsx", [
    route("admin/crm", "./routes/admin.crm._index.tsx"),
    route("admin/crm/:id", "./routes/admin.crm.$id.tsx"),
  ]),

  // ----------------------------------------------------------------
  // Upload API — server-side file handling
  // ----------------------------------------------------------------
  route("api/upload", "./routes/upload/api.upload.ts"),
  route("api/delete-file", "./routes/upload/api.delete-file.ts"),
] satisfies RouteConfig;
