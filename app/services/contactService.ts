import { supabase } from "../supabase-client";
import type { ContactSubmissionRow } from "../types";

export const contactService = {
  getAll: async (): Promise<ContactSubmissionRow[]> => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  updateStatus: async (
    id: number,
    status: ContactSubmissionRow["status"],
  ): Promise<void> => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
