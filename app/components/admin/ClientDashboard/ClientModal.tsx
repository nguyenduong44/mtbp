import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useIndustries } from "@/app/hooks/useIndustries";
import { useServicePackages } from "@/app/hooks/useServicePackages";
import { useCreateClient, useUpdateClient } from "@/app/hooks/useClients";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ClientFormData } from "@/app/types";
import { useCanViewRevenue } from "@/app/hooks/useCanViewRevenue";

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
  const { data: industriesData } = useIndustries();
  const industries = industriesData?.data || [];
  const { data: packages } = useServicePackages();
  const create = useCreateClient();
  const update = useUpdateClient();

  const canViewRevenue = useCanViewRevenue();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        industry_id: initialData.industry_id,
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
      <DialogContent className="max-w-[560px] p-0 rounded-[var(--crm-r-lg)] border-none shadow-[0_25px_60px_rgba(0,0,0,0.28)] overflow-hidden max-h-[92vh]">
        {/* modal-head */}
        <div className="p-[20px_24px_16px] border-b border-[var(--crm-border)] flex items-center justify-between sticky top-0 bg-[var(--crm-surface)] z-[1]">
          <DialogTitle className="text-[18px] font-[700] text-[var(--crm-navy)]">
            {initialData ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="w-[34px] h-[34px] flex items-center justify-center border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[var(--crm-text)] hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all active:scale-[0.97]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* modal-body */}
          <div className="p-[24px] space-y-[16px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="md:col-span-2 flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Tên khách hàng{" "}
                  <span className="text-[var(--crm-red)] ml-[2px]">*</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  placeholder="VD: Café Xoài, Spa Bình An…"
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Ngành nghề / Loại hình{" "}
                  <span className="text-[var(--crm-red)] ml-[2px]">*</span>
                </label>
                <select
                  {...register("industry_id", { required: true })}
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none cursor-pointer focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                >
                  <option value="">— Chọn ngành nghề —</option>
                  {industries?.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Gói dịch vụ{" "}
                  <span className="text-[var(--crm-red)] ml-[2px]">*</span>
                </label>
                <select
                  {...register("package_id", { required: true })}
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none cursor-pointer focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                >
                  <option value="">— Chọn gói —</option>
                  {packages?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Người liên hệ{" "}
                  <span className="text-[var(--crm-red)] ml-[2px]">*</span>
                </label>
                <input
                  {...register("contact_person", { required: true })}
                  placeholder="Tên người liên hệ"
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Số điện thoại / Zalo
                </label>
                <input
                  {...register("phone")}
                  placeholder="0912 345 678"
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                />
              </div>

              {canViewRevenue && (
                <div className="flex flex-col gap-[5px]">
                  <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                    Chi phí hàng tháng (VND){" "}
                    <span className="text-[var(--crm-red)] ml-[2px]">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("monthly_cost", { required: true })}
                    placeholder="5000000"
                    className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                    step="500000"
                  />
                </div>
              )}

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Ngày bắt đầu hợp đồng
                </label>
                <input
                  type="date"
                  {...register("contract_start_date")}
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-[5px]">
                <label className="text-[13px] font-[600] text-[var(--crm-text)]">
                  Ghi chú
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Mục tiêu, yêu cầu đặc biệt, lịch sử làm việc…"
                  className="p-[10px_13px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all resize-y min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* modal-foot */}
          <div className="p-[16px_24px] border-t border-[var(--crm-border)] flex gap-[10px] justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-[20px] py-[10px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] font-[600] bg-white hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all active:scale-[0.97]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="bg-[var(--crm-navy)] hover:bg-[var(--crm-navy-light)] text-white px-[20px] py-[10px] rounded-[var(--crm-r)] text-[14px] font-[600] transition-all active:scale-[0.97]"
            >
              {create.isPending || update.isPending
                ? "Đang lưu..."
                : "💾 Lưu khách hàng"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
