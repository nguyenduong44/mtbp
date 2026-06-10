import { supabase } from "../supabase-client";
import type { IndustryRow } from "../types";

type GetIndustriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "display_order" | "name";
  sortOrder?: "asc" | "desc";
};

export const industryService = {
  getAll: async ({
    page = 1,
    limit = 100,
    search = "",
    sortBy = "display_order",
    sortOrder = "asc",
  }: GetIndustriesParams = {}): Promise<{
    data: IndustryRow[];
    count: number;
  }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("industries").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) throw error;
    return { data: data as IndustryRow[], count: count ?? 0 };
  },

  getById: async (id: number): Promise<IndustryRow> => {
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  getBySlug: async (slug: string): Promise<IndustryRow> => {
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (
    industry: Omit<IndustryRow, "id" | "created_at">,
  ): Promise<IndustryRow> => {
    const { data, error } = await supabase
      .from("industries")
      .insert(industry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (
    id: number,
    updates: Partial<IndustryRow>,
  ): Promise<IndustryRow> => {
    const { data, error } = await supabase
      .from("industries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("industries").delete().eq("id", id);
    if (error) throw error;
  },
};
