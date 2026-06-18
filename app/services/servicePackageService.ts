import { supabase } from "../supabase-client";
import type { ServicePackage } from "../types";

export const servicePackageService = {
  getAll: async (): Promise<ServicePackage[]> => {
    const { data, error } = await supabase
      .from("service_packages")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};
