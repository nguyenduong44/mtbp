import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Sửa công việc" : "Thêm công việc mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tiêu đề *</label>
            <input
              {...register("title", { required: true })}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mô tả</label>
            <textarea
              {...register("description")}
              rows={2}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Deadline</label>
              <input
                type="date"
                {...register("deadline")}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phụ trách</label>
              <input
                {...register("assigned_to")}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ưu tiên</label>
              <select
                {...register("priority")}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="high">🔴 Cao</option>
                <option value="medium">🟡 Trung bình</option>
                <option value="low">🟢 Thấp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Trạng thái</label>
              <select
                {...register("status")}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="todo">📋 Cần làm</option>
                <option value="doing">🔄 Đang làm</option>
                <option value="done">✅ Đã hoàn thành</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
