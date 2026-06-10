// app/services/projectService.ts

import { supabase } from "../supabase-client";
import type { ProjectRow, ProjectWithDetails } from "../types";
import { uploadService } from "./uploadService";

// ----------------------------------------------------------------
// Input Types (dùng cho create/update)
// ----------------------------------------------------------------

type MediaItemInput = {
  id?: number;
  type: "image" | "video";
  url?: string;
  file?: File;
  caption?: string | null;
  _deleted?: boolean;
};

type MediaSectionInput = {
  id?: number;
  title: string;
  items: MediaItemInput[];
};

type SocialLinkInput = {
  id?: number;
  platform: string;
  url: string;
  label?: string | null;
  _deleted?: boolean;
};

type ProjectInput = Partial<ProjectRow> & {
  thumbnailFile?: File | null;
};

type CreateProjectArgs = {
  project: ProjectInput;
  categoryIds: number[];
  mediaSections: MediaSectionInput[];
  socialLinks: SocialLinkInput[];
};

type UpdateProjectArgs = {
  project: ProjectInput;
  categoryIds: number[];
  mediaSections: MediaSectionInput[];
  socialLinks: SocialLinkInput[];
};

type GetProjectsParams = {
  page?: number;
  limit?: number;
  search?: string;
  clientId?: number | null;
  categoryId?: number | null;
  categorySlug?: string | null;
  featured?: boolean | null;
  sortBy?: "created_at" | "title";
  sortOrder?: "asc" | "desc";
  industryId?: number | null;
  industrySlug?: string | null;
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/** Upload ảnh nếu có file mới, ngược lại giữ URL cũ */
async function resolveImageUrl(
  file?: File | null,
  existingUrl?: string | null,
): Promise<string | null> {
  if (file) return uploadService.uploadFile(file, "image");
  return existingUrl ?? null;
}

/**
 * Upload song song tất cả items có file mới trong một section.
 * Trả về mảng objects sẵn sàng để insert vào DB.
 */
async function prepareItemsForInsert(
  sectionId: number,
  items: MediaItemInput[],
): Promise<
  Array<{
    section_id: number;
    type: string;
    url: string;
    caption: string | null;
    display_order: number;
  }>
> {
  return Promise.all(
    items.map(async (item, idx) => {
      let url = item.url ?? "";
      if (item.type === "image" && item.file) {
        url = await uploadService.uploadFile(item.file, "image");
      }
      // Đối với video, user nhập link embed nên không cần upload file nữa
      return {
        section_id: sectionId,
        type: item.type,
        url: url.trim(),
        caption: item.caption ?? null,
        display_order: idx,
      };
    }),
  );
}

// ----------------------------------------------------------------
// Service
// ----------------------------------------------------------------

export const projectService = {
  // ------ READ ------

  getAll: async ({
    page = 1,
    limit = 10,
    search = "",
    clientId,
    categoryId,
    categorySlug,
    industrySlug,
    featured,
    sortBy = "created_at",
    sortOrder = "desc",
  }: GetProjectsParams = {}): Promise<{
    data: any[];
    count: number;
  }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Logic xây dựng select string linh hoạt để hỗ trợ inner join khi lọc
    let clientsPart = "clients(name, industries:industry_id(name, slug))";
    let categoriesPart = "project_categories(categories(name, slug))";

    // Nếu lọc theo industry, ép kiểu inner join cho cả client và industry
    if (industrySlug && industrySlug !== "all") {
      // Khi lọc, ta dùng tên relation chuẩn là industries để PostgREST hiểu đường dẫn lọc
      clientsPart = "clients!inner(name, industries!inner(name, slug))";
    }

    // Nếu lọc theo category, ép kiểu inner join cho bảng trung gian và bảng categories
    if (categoryId || (categorySlug && categorySlug !== "all")) {
      const catInner = categorySlug && categorySlug !== "all" ? "!inner" : "";
      categoriesPart = `project_categories!inner(category_id, categories${catInner}(name, slug))`;
    }

    const selectStr = `*, ${clientsPart}, ${categoriesPart}`;

    let query = supabase.from("projects").select(selectStr, { count: "exact" });

    // Tìm kiếm theo tên dự án (ilike)
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    // Lọc theo client
    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    // Lọc theo category
    if (categoryId) {
      query = query.eq("project_categories.category_id", categoryId);
    }
    if (categorySlug && categorySlug !== "all") {
      query = query.eq("project_categories.categories.slug", categorySlug);
    }

    // Lọc theo industry - dùng đường dẫn relation chuẩn (industries)
    if (industrySlug && industrySlug !== "all") {
      query = query.eq("clients.industries.slug", industrySlug);
    }

    // Lọc theo featured
    if (featured !== undefined && featured !== null) {
      query = query.eq("featured", featured);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) throw error;

    // Reshape data to flatten categories
    const projects = (data as any[]).map((p) => ({
      ...p,
      categories: p.project_categories?.map((pc: any) => pc.categories) || [],
    }));

    return { data: projects, count: count ?? 0 };
  },

  /** Lấy chi tiết 1 project bằng ID (dùng trong admin edit) */
  getById: async (id: number): Promise<ProjectWithDetails> => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        clients(name, logo, industry_id, industries:industry_id(name, slug)),
        project_categories(categories(*)),
        media_sections(id, title, display_order, media_items(*)),
        social_links(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      ...data,
      categories:
        data.project_categories?.map((pc: any) => pc.categories) ?? [],
      media_sections: (data.media_sections ?? []).map((s: any) => ({
        ...s,
        media_items: (s.media_items ?? []).sort(
          (a: any, b: any) => a.display_order - b.display_order,
        ),
      })),
      social_links: data.social_links ?? [],
    };
  },

  /** Lấy chi tiết 1 project bằng slug (dùng trong public page) */
  getBySlug: async (slug: string): Promise<ProjectWithDetails> => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        clients(name, logo, industry_id, industries:industry_id(name, slug)),
        project_categories(categories(*)),
        media_sections(id, title, display_order, media_items(*)),
        social_links(*)
      `,
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return {
      ...data,
      categories:
        data.project_categories?.map((pc: any) => pc.categories) ?? [],
      media_sections: (data.media_sections ?? []).map((s: any) => ({
        ...s,
        media_items: (s.media_items ?? []).sort(
          (a: any, b: any) => a.display_order - b.display_order,
        ),
      })),
      social_links: data.social_links ?? [],
    };
  },

  /** Lấy danh sách projects cho public (có filter theo category slug) */
  getPublicList: async (
    categorySlug?: string,
  ): Promise<ProjectWithDetails[]> => {
    let query = supabase
      .from("projects")
      .select(
        `
        *,
        clients(name, logo, industry_id, industries:industry_id(name, slug)),
        project_categories(categories(*)),
        media_sections(id, title, display_order, media_items(*)),
        social_links(*)
      `,
      )
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    let results = (data ?? []).map((p: any) => ({
      ...p,
      categories: p.project_categories?.map((pc: any) => pc.categories) ?? [],
      media_sections: p.media_sections ?? [],
      social_links: p.social_links ?? [],
    }));

    // Filter theo category slug nếu có
    if (categorySlug && categorySlug !== "all") {
      results = results.filter((p) =>
        p.categories.some((c: any) => c.slug === categorySlug),
      );
    }

    return results;
  },

  // ------ CREATE ------

  createFull: async (args: CreateProjectArgs): Promise<number> => {
    const { project, categoryIds, mediaSections, socialLinks } = args;

    // 1. Upload thumbnail nếu có
    const thumbnail = await resolveImageUrl(
      project.thumbnailFile,
      project.thumbnail,
    );

    // 2. Insert project
    const { data: newProject, error: projErr } = await supabase
      .from("projects")
      .insert({
        title: project.title,
        slug: project.slug,
        client_id: project.client_id ?? null,
        overview: project.overview ?? null,
        solution: project.solution ?? null,
        scope: project.scope ?? null,
        results: project.results ?? null,
        featured: project.featured ?? false,
        thumbnail,
      })
      .select()
      .single();

    if (projErr) throw projErr;
    const projectId = newProject.id;

    // 3. Insert categories (batch)
    if (categoryIds.length > 0) {
      const { error: catErr } = await supabase
        .from("project_categories")
        .insert(
          categoryIds.map((catId) => ({
            project_id: projectId,
            category_id: catId,
          })),
        );
      if (catErr)
        console.warn("[createFull] Category insert error:", catErr.message);
    }

    // 4. Insert media sections + items
    for (let secIdx = 0; secIdx < mediaSections.length; secIdx++) {
      const section = mediaSections[secIdx];

      const { data: sectionRow, error: secErr } = await supabase
        .from("media_sections")
        .insert({
          project_id: projectId,
          title: section.title,
          display_order: secIdx,
        })
        .select()
        .single();

      if (secErr || !sectionRow) {
        console.warn("[createFull] Section insert error:", secErr?.message);
        continue;
      }

      // Upload song song + batch insert toàn bộ items của section
      const itemsPayload = await prepareItemsForInsert(
        sectionRow.id,
        section.items,
      );
      if (itemsPayload.length > 0) {
        const { error: itemsErr } = await supabase
          .from("media_items")
          .insert(itemsPayload);
        if (itemsErr)
          console.warn("[createFull] Items insert error:", itemsErr.message);
      }
    }

    // 5. Insert social links (batch)
    const validLinks = socialLinks.filter((l) => l.url.trim());
    if (validLinks.length > 0) {
      await supabase.from("social_links").insert(
        validLinks.map((l) => ({
          project_id: projectId,
          platform: l.platform,
          url: l.url,
          label: l.label ?? null,
        })),
      );
    }

    return projectId;
  },

  // ------ UPDATE ------

  updateFull: async (id: number, args: UpdateProjectArgs): Promise<void> => {
    const { project, categoryIds, mediaSections, socialLinks } = args;

    // 1. Lấy thumbnail cũ để xóa nếu thay đổi
    const { data: oldProject } = await supabase
      .from("projects")
      .select("thumbnail")
      .eq("id", id)
      .single();

    // 2. Upload thumbnail mới nếu có
    const thumbnail = await resolveImageUrl(
      project.thumbnailFile,
      project.thumbnail,
    );

    // Xóa thumbnail cũ nếu đã thay đổi
    if (
      project.thumbnailFile &&
      oldProject?.thumbnail &&
      oldProject.thumbnail !== thumbnail
    ) {
      await uploadService.deleteFile(oldProject.thumbnail);
    }

    // 3. Update project record
    const { error: projErr } = await supabase
      .from("projects")
      .update({
        title: project.title,
        slug: project.slug,
        client_id: project.client_id ?? null,
        overview: project.overview ?? null,
        solution: project.solution ?? null,
        scope: project.scope ?? null,
        results: project.results ?? null,
        featured: project.featured ?? false,
        thumbnail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (projErr) throw projErr;

    // 4. Categories: xóa hết rồi insert lại (đơn giản, ít record)
    await supabase.from("project_categories").delete().eq("project_id", id);
    if (categoryIds.length > 0) {
      await supabase
        .from("project_categories")
        .insert(
          categoryIds.map((catId) => ({ project_id: id, category_id: catId })),
        );
    }

    // 5. Media sections & items
    await updateMediaSections(id, mediaSections);

    // 6. Social links
    await updateSocialLinks(id, socialLinks);
  },

  // ------ DELETE ------

  delete: async (id: number): Promise<void> => {
    // 1. Lấy tất cả URL file cần xóa (thumbnail + media items)
    const { data: proj } = await supabase
      .from("projects")
      .select("thumbnail")
      .eq("id", id)
      .single();

    const { data: sections } = await supabase
      .from("media_sections")
      .select("id")
      .eq("project_id", id);

    const sectionIds = sections?.map((s) => s.id) ?? [];
    let itemUrls: string[] = [];

    if (sectionIds.length > 0) {
      const { data: items } = await supabase
        .from("media_items")
        .select("url")
        .in("section_id", sectionIds);
      itemUrls = items?.map((i) => i.url) ?? [];
    }

    // 2. Xóa files local song song
    const allUrls = [proj?.thumbnail, ...itemUrls].filter(Boolean) as string[];
    await uploadService.deleteFiles(allUrls);

    // 3. Xóa DB record (CASCADE tự lo sections, items, links, categories)
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },
};

// ----------------------------------------------------------------
// Private helpers cho updateFull
// ----------------------------------------------------------------

async function updateMediaSections(
  projectId: number,
  inputSections: MediaSectionInput[],
) {
  // Lấy danh sách section IDs hiện tại trong DB
  const { data: dbSections } = await supabase
    .from("media_sections")
    .select("id")
    .eq("project_id", projectId);

  const dbSectionIds = dbSections?.map((s) => s.id) ?? [];
  const keptSectionIds: number[] = [];

  for (const section of inputSections) {
    if (section.id && dbSectionIds.includes(section.id)) {
      // --- Section đã tồn tại: update title ---
      await supabase
        .from("media_sections")
        .update({ title: section.title })
        .eq("id", section.id);

      keptSectionIds.push(section.id);
      await updateItemsInSection(section.id, section.items);
    } else {
      // --- Section mới: insert section + batch insert items ---
      const { data: newSection, error: secErr } = await supabase
        .from("media_sections")
        .insert({
          project_id: projectId,
          title: section.title,
          display_order: 0,
        })
        .select()
        .single();

      if (secErr || !newSection) {
        console.warn("[updateFull] Tạo section mới thất bại:", secErr?.message);
        continue;
      }

      keptSectionIds.push(newSection.id);

      const itemsPayload = await prepareItemsForInsert(
        newSection.id,
        section.items.filter((i) => !i._deleted),
      );
      if (itemsPayload.length > 0) {
        await supabase.from("media_items").insert(itemsPayload);
      }
    }
  }

  // Xóa các sections đã bị loại khỏi form (kèm xóa file)
  const toDeleteSectionIds = dbSectionIds.filter(
    (sid) => !keptSectionIds.includes(sid),
  );
  if (toDeleteSectionIds.length > 0) {
    await deleteSectionsWithFiles(toDeleteSectionIds);
  }
}

async function updateItemsInSection(
  sectionId: number,
  inputItems: MediaItemInput[],
) {
  // Lấy items hiện tại trong DB
  const { data: dbItems } = await supabase
    .from("media_items")
    .select("id, url")
    .eq("section_id", sectionId);

  const dbItemMap = new Map(dbItems?.map((i) => [i.id, i.url]) ?? []);
  const keptItemIds: number[] = [];
  const newItems: Array<{ item: MediaItemInput; displayOrder: number }> = [];

  // Phân loại items
  for (let idx = 0; idx < inputItems.length; idx++) {
    const item = inputItems[idx];
    if (item._deleted) continue;

    if (item.id && dbItemMap.has(item.id)) {
      // Item cũ còn giữ lại: update url (cho video link), caption và order
      await supabase
        .from("media_items")
        .update({
          url: item.url,
          caption: item.caption ?? null,
          display_order: idx,
        })
        .eq("id", item.id);
      keptItemIds.push(item.id);
    } else {
      // Item mới cần insert
      newItems.push({ item, displayOrder: idx });
    }
  }

  // Batch insert các items mới (upload song song trước)
  if (newItems.length > 0) {
    const itemsPayload = await prepareItemsForInsert(
      sectionId,
      newItems.map(({ item, displayOrder }) => ({
        ...item,
        display_order: displayOrder,
      })),
    );
    if (itemsPayload.length > 0) {
      await supabase.from("media_items").insert(itemsPayload);
    }
  }

  // Xóa items bị loại khỏi form (kèm xóa file local)
  const toDeleteIds = Array.from(dbItemMap.keys()).filter(
    (id) => !keptItemIds.includes(id),
  );
  if (toDeleteIds.length > 0) {
    const urlsToDelete = toDeleteIds.map((id) => dbItemMap.get(id)!);
    await uploadService.deleteFiles(urlsToDelete);
    await supabase.from("media_items").delete().in("id", toDeleteIds);
  }
}

async function deleteSectionsWithFiles(sectionIds: number[]) {
  // Lấy tất cả URL file trong các sections cần xóa
  const { data: items } = await supabase
    .from("media_items")
    .select("url")
    .in("section_id", sectionIds);

  const urlsToDelete = items?.map((i) => i.url) ?? [];
  await uploadService.deleteFiles(urlsToDelete);

  // Xóa sections (CASCADE xóa media_items)
  await supabase.from("media_sections").delete().in("id", sectionIds);
}

async function updateSocialLinks(
  projectId: number,
  inputLinks: SocialLinkInput[],
) {
  const { data: dbLinks } = await supabase
    .from("social_links")
    .select("id")
    .eq("project_id", projectId);

  const dbLinkIds = dbLinks?.map((l) => l.id) ?? [];
  const keptIds: number[] = [];

  for (const link of inputLinks) {
    if (link._deleted || !link.url.trim()) continue;

    if (link.id && dbLinkIds.includes(link.id)) {
      // Cập nhật link cũ
      await supabase
        .from("social_links")
        .update({
          platform: link.platform,
          url: link.url,
          label: link.label ?? null,
        })
        .eq("id", link.id);
      keptIds.push(link.id);
    } else {
      // Thêm link mới
      const { data: newLink } = await supabase
        .from("social_links")
        .insert({
          project_id: projectId,
          platform: link.platform,
          url: link.url,
          label: link.label ?? null,
        })
        .select()
        .single();
      if (newLink) keptIds.push(newLink.id);
    }
  }

  // Xóa links không còn trong form
  const toDeleteIds = dbLinkIds.filter((id) => !keptIds.includes(id));
  if (toDeleteIds.length > 0) {
    await supabase.from("social_links").delete().in("id", toDeleteIds);
  }
}
