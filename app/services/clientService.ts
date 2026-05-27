import { supabase } from "../supabase-client";
import type { ClientRow } from "../types";

export const clientService = {
  getAll: async (): Promise<ClientRow[]> => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("name");
    if (error) throw error;
    return data || [];
  },

  getById: async (id: number): Promise<ClientRow> => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;
  },
};
