import { supabase } from "../supabase-client";

type SiteSetting = {
  key: string;
  value: any;
  updated_at: string;
};

export const settingService = {
  getAll: async (): Promise<Record<string, any>> => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) throw error;
    const map: Record<string, any> = {};
    data?.forEach((s: any) => (map[s.key] = s.value));
    return map;
  },

  update: async (key: string, value: any): Promise<void> => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  },

  updateBatch: async (
    updates: Array<{ key: string; value: any }>,
  ): Promise<void> => {
    await Promise.all(
      updates.map((u) => settingService.update(u.key, u.value)),
    );
  },
};
