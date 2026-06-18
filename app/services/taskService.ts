import { supabase } from "../supabase-client";
import type { TaskRow } from "../types";

export const taskService = {
  getByClient: async (clientId: number): Promise<TaskRow[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("client_id", clientId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  create: async (
    task: Omit<
      TaskRow,
      "id" | "created_at" | "updated_at" | "completed_at" | "sort_order"
    >,
  ): Promise<TaskRow> => {
    // Lấy sort_order lớn nhất trong cùng status
    const { data: maxOrder } = await supabase
      .from("tasks")
      .select("sort_order")
      .eq("client_id", task.client_id)
      .eq("status", task.status)
      .order("sort_order", { ascending: false })
      .limit(1);

    const newOrder = (maxOrder?.[0]?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...task, sort_order: newOrder })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: number, updates: Partial<TaskRow>): Promise<TaskRow> => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateStatus: async (
    id: number,
    status: TaskRow["status"],
    clientId: number,
  ): Promise<void> => {
    // Cập nhật status và sort_order (đẩy xuống cuối cột mới)
    const { data: maxOrder } = await supabase
      .from("tasks")
      .select("sort_order")
      .eq("client_id", clientId)
      .eq("status", status)
      .order("sort_order", { ascending: false })
      .limit(1);

    const newOrder = (maxOrder?.[0]?.sort_order ?? -1) + 1;

    const { error } = await supabase
      .from("tasks")
      .update({ status, sort_order: newOrder })
      .eq("id", id);
    if (error) throw error;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
};
