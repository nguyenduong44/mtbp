import { supabase } from "../supabase-client";
import type { ClientRow } from "../types";
import { uploadService } from "./uploadService";

type GetClientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
};

export const clientService = {
  getAll: async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "name",
    sortOrder = "asc",
  }: GetClientsParams = {}): Promise<{ data: ClientRow[]; count: number }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("clients").select(
      `
      *,
      industries:industry_id (name, slug)
    `,
      { count: "exact" },
    );

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) throw error;

    const transformed = (data || []).map((item: any) => ({
      ...item,
      industry_name: item.industries?.name || null,
      industry_slug: item.industries?.slug || null,
    }));
    return { data: transformed as ClientRow[], count: count ?? 0 };
  },
  getById: async (id: number): Promise<ClientRow> => {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `
      *,
      industries:industry_id (name, slug)
    `,
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return {
      ...data,
      industry_name: data.industries?.name || null,
      industry_slug: data.industries?.slug || null,
    } as ClientRow;
  },

  create: async (client: Omit<ClientRow, "id">): Promise<ClientRow> => {
    const { data, error } = await supabase
      .from("clients")
      .insert(client)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (
    id: number,
    updates: Partial<ClientRow>,
  ): Promise<ClientRow> => {
    // 1. Lấy logo cũ trước khi update
    const { data: oldClient } = await supabase
      .from("clients")
      .select("logo")
      .eq("id", id)
      .single();

    // 2. Thực hiện update
    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // 3. Nếu update logo thành công và có logo cũ khác logo mới, xóa file cũ
    if (updates.logo && oldClient?.logo && oldClient.logo !== updates.logo) {
      await uploadService.deleteFile(oldClient.logo);
    }

    return data;
  },

  delete: async (id: number): Promise<void> => {
    // 1. Lấy thông tin logo trước khi xóa bản ghi
    const { data: client } = await supabase
      .from("clients")
      .select("logo")
      .eq("id", id)
      .single();

    // 2. Xóa bản ghi trong DB
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;

    // 3. Nếu xóa DB thành công, xóa file vật lý
    if (client?.logo) {
      await uploadService.deleteFile(client.logo);
    }
  },
};
