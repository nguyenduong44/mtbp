import { supabase } from "../supabase-client";
import type { ProcessRow } from "../types";

export const processService = {
  getAll: async (): Promise<ProcessRow[]> => {
    const { data, error } = await supabase
      .from("processes")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: number): Promise<ProcessRow> => {
    const { data, error } = await supabase
      .from("processes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    process: Omit<ProcessRow, "id" | "display_order">,
  ): Promise<ProcessRow> => {
    // Lấy display_order lớn nhất + 1
    const { data: maxOrderData } = await supabase
      .from("processes")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder = (maxOrderData?.[0]?.display_order ?? 0) + 1;
    const { data, error } = await supabase
      .from("processes")
      .insert({ ...process, display_order: nextOrder })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (
    id: number,
    updates: Partial<ProcessRow>,
  ): Promise<ProcessRow> => {
    const { data, error } = await supabase
      .from("processes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("processes").delete().eq("id", id);
    if (error) throw error;
  },
};
