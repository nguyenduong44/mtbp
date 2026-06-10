import { supabase } from "../supabase-client";
import type { Category } from "../types";
import { uploadService } from "./uploadService";

type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "display_order" | "name";
  sortOrder?: "asc" | "desc";
};

export const categoryService = {
  getAll: async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "display_order",
    sortOrder = "asc",
  }: GetCategoriesParams = {}): Promise<{
    data: Category[];
    count: number;
  }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("categories").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) throw error;
    return { data: data as Category[], count: count ?? 0 };
  },
  getById: async (id: number): Promise<Category> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (category: Omit<Category, "id">): Promise<Category> => {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: number, updates: Partial<Category>): Promise<Category> => {
    // 1. Lấy icon cũ trước khi update
    const { data: oldCategory } = await supabase
      .from("categories")
      .select("icon_url")
      .eq("id", id)
      .single();

    // 2. Thực hiện update
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // 3. Nếu update icon_url thành công và có file cũ khác file mới, xóa file cũ
    if (
      updates.icon_url &&
      oldCategory?.icon_url &&
      oldCategory.icon_url !== updates.icon_url
    ) {
      await uploadService.deleteFile(oldCategory.icon_url);
    }

    return data;
  },
  delete: async (id: number): Promise<void> => {
    // 1. Lấy URL icon trước khi xóa bản ghi
    const { data: category } = await supabase
      .from("categories")
      .select("icon_url")
      .eq("id", id)
      .single();

    // 2. Xóa trong DB
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;

    // 3. Xóa file vật lý nếu xóa DB thành công
    if (category?.icon_url) {
      await uploadService.deleteFile(category.icon_url);
    }
  },
};
