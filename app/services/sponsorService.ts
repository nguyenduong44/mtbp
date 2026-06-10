import { supabase } from "../supabase-client";
import type { SponsorRow } from "../types";
import { uploadService } from "./uploadService";

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
    // 1. Lấy logo cũ trước khi update
    const { data: oldSponsor } = await supabase
      .from("sponsors")
      .select("logo_url")
      .eq("id", id)
      .single();

    // 2. Thực hiện update
    const { data, error } = await supabase
      .from("sponsors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // 3. Nếu update logo thành công và có logo cũ khác logo mới, xóa file cũ
    if (
      updates.logo_url &&
      oldSponsor?.logo_url &&
      oldSponsor.logo_url !== updates.logo_url
    ) {
      await uploadService.deleteFile(oldSponsor.logo_url);
    }

    return data;
  },
  delete: async (id: number): Promise<void> => {
    // 1. Lấy URL logo trước khi xóa bản ghi
    const { data: sponsor } = await supabase
      .from("sponsors")
      .select("logo_url")
      .eq("id", id)
      .single();

    // 2. Xóa trong DB
    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    if (error) throw error;

    // 3. Xóa file vật lý nếu xóa DB thành công
    if (sponsor?.logo_url) {
      await uploadService.deleteFile(sponsor.logo_url);
    }
  },
};
