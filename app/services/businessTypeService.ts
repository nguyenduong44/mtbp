import { supabase } from "../supabase-client";
import type { BusinessType } from "../types";

export const businessTypeService = {
  getAll: async (): Promise<BusinessType[]> => {
    const { data, error } = await supabase
      .from("business_types")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};
