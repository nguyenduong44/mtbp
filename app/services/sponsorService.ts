import { supabase } from "../supabase-client";
import type { SponsorRow } from "../types";

export const sponsorService = {
  getAll: async (): Promise<SponsorRow[]> => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: number): Promise<SponsorRow> => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (sponsor: Omit<SponsorRow, "id">): Promise<SponsorRow> => {
    const { data, error } = await supabase
      .from("sponsors")
      .insert(sponsor)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (
    id: number,
    updates: Partial<SponsorRow>,
  ): Promise<SponsorRow> => {
    const { data, error } = await supabase
      .from("sponsors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    if (error) throw error;
  },
};
