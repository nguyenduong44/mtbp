import { supabase } from "../supabase-client";
import type { Category } from "../types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};
