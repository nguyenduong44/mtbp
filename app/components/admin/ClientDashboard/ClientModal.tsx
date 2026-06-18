import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useBusinessTypes } from "@/app/hooks/useBusinessTypes";
import { useServicePackages } from "@/app/hooks/useServicePackages";
import { useCreateClient, useUpdateClient } from "@/app/hooks/useClients";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ClientFormData } from "@/app/types";

export default function ClientModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<ClientFormData>();
  const { data: businessTypes } = useBusinessTypes();
  const { data: packages } = useServicePackages();
  const create = useCreateClient();
  const update = useUpdateClient();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        business_type_id: initialData.business_type_id,
        package_id: initialData.package_id,
        contact_person: initialData.contact_person,
        phone: initialData.phone,
        monthly_cost: Number(initialData.monthly_cost) || 0,
        contract_start_date: initialData.contract_start_date,
        notes: initialData.notes,
        assigned_to: initialData.assigned_to,
      });
    } else {
      reset({});
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: ClientFormData) => {
    if (initialData) {
      await update.mutateAsync({ id: initialData.id, updates: data });
    } else {
      await create.mutateAsync(data as any);
    }
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Sửa khách hàng" : "Thêm khách hàng mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Tên khách hàng *
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Loại hình</label>
              <select
                {...register("business_type_id")}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">Chọn</option>
                {businessTypes?.map((bt) => (
                  <option key={bt.id} value={bt.id}>
                    {bt.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Gói dịch vụ</label>
              <select
                {...register("package_id")}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">Chọn</option>
                {packages?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Người liên hệ</label>
              <input
                {...register("contact_person")}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">SĐT / Zalo</label>
              <input
                {...register("phone")}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Chi phí hàng tháng (VND)
              </label>
              <input
                type="number"
                {...register("monthly_cost")}
                className="w-full border p-2 rounded mt-1"
                step="500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Ngày bắt đầu hợp đồng
              </label>
              <input
                type="date"
                {...register("contract_start_date")}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Phụ trách (tên nhân viên)
              </label>
              <input
                {...register("assigned_to")}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Ghi chú</label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full border p-2 rounded mt-1"
              />
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
