import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useCreateTask, useUpdateTask } from "@/app/hooks/useTasks";
import { useEffect } from "react";
import type { TaskFormData } from "@/app/types";
import { Button } from "@/components/ui/button";

export default function TaskModal({
  isOpen,
  onClose,
  clientId,
  initialData,
  defaultStatus,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  initialData?: any;
  defaultStatus?: "todo" | "doing" | "done";
  onSuccess: () => void;
}) {
  const { register, handleSubmit, reset, setValue } = useForm<TaskFormData>();
  const create = useCreateTask();
  const update = useUpdateTask();

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        deadline: initialData.deadline,
        assigned_to: initialData.assigned_to,
        priority: initialData.priority,
        status: initialData.status,
      });
    } else {
      reset({
        status: defaultStatus || "todo",
        priority: "medium",
      });
    }
  }, [initialData, reset, defaultStatus, isOpen]);

  const onSubmit = async (data: TaskFormData) => {
    if (initialData) {
      await update.mutateAsync({ id: initialData.id, updates: data });
    } else {
      await create.mutateAsync({ ...data, client_id: clientId });
    }
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[460px] p-0 rounded-[var(--crm-r-lg)] border-none shadow-[0_25px_60px_rgba(0,0,0,0.28)] overflow-hidden max-h-[92vh]">
        {/* modal-head */}
        <div className="p-[20px_24px_16px] border-b border-[var(--crm-border)] flex items-center justify-between sticky top-0 bg-[var(--crm-surface)] z-[1]">
          <DialogTitle className="text-[18px] font-[700] text-[var(--crm-navy)]">
            {initialData ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
          </DialogTitle>
          <button onClick={onClose} className="w-[34px] h-[34px] flex items-center justify-center border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[var(--crm-text)] hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all active:scale-[0.97]">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* modal-body */}
          <div className="p-[24px] space-y-[16px]">
            <div className="flex flex-col gap-[5px]">
              <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                Tiêu đề công việc <span className="text-[var(--crm-red)] ml-[2px]">*</span>
              </label>
              <input
                {...register("title", { required: true })}
                placeholder="VD: Chụp ảnh sản phẩm mới tháng 6"
                className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label className="text-[13px] font-[600] text-[var(--crm-text)]">Mô tả ngắn</label>
              <textarea
                {...register("description")}
                placeholder="Chi tiết thêm về công việc này…"
                className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all resize-y min-h-[68px]"
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label className="text-[13px] font-[600] text-[var(--crm-text)]">Ngày deadline</label>
              <input
                type="date"
                {...register("deadline")}
                className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label className="text-[13px] font-[600] text-[var(--crm-text)]">Mức độ ưu tiên</label>
              <select
                {...register("priority")}
                className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none cursor-pointer focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
              >
                <option value="high">🔴 Cao</option>
                <option value="medium">🟡 Trung bình</option>
                <option value="low">🟢 Thấp</option>
              </select>
            </div>

            <div className="flex flex-col gap-[5px]">
              <label className="text-[13px] font-[600] text-[var(--crm-text)]">Trạng thái</label>
              <select
                {...register("status")}
                className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none cursor-pointer focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
              >
                <option value="todo">📋 Cần làm</option>
                <option value="doing">🔄 Đang làm</option>
                <option value="done">✅ Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* modal-foot */}
          <div className="p-[16px_24px] border-t border-[var(--crm-border)] flex gap-[10px] justify-end">
            <button type="button" onClick={onClose} className="px-[20px] py-[10px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] font-[600] bg-white hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all active:scale-[0.97]">
              Hủy
            </button>
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="bg-[var(--crm-navy)] hover:bg-[var(--crm-navy-light)] text-white px-[20px] py-[10px] rounded-[var(--crm-r)] text-[14px] font-[600] transition-all active:scale-[0.97]"
            >
              {create.isPending || update.isPending ? "Đang lưu..." : "💾 Lưu công việc"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
