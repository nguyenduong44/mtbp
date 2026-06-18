import type { ClientRow } from "@/app/types";
import { Link, useNavigate } from "react-router";
import { useAllTasks } from "@/app/hooks/useTasks";

export default function ClientGrid({
  clients,
  onEdit,
}: {
  clients: ClientRow[];
  onEdit: (c: ClientRow) => void;
}) {
  const { data: allTasks } = useAllTasks();
  const navigate = useNavigate();

  const getNearestDl = (clientId: number) => {
    const tasks =
      allTasks?.filter(
        (t) => t.client_id === clientId && t.status !== "done",
      ) || [];
    let nearest = null;
    for (const t of tasks) {
      if (t.deadline) {
        const d = new Date(t.deadline);
        if (!nearest || d < nearest) nearest = d;
      }
    }
    return nearest;
  };

  const getDlStatus = (clientId: number) => {
    const d = getNearestDl(clientId);
    if (!d) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dc = new Date(d);
    dc.setHours(0, 0, 0, 0);
    const diff = Math.ceil((dc.getTime() - now.getTime()) / 864e5);

    if (diff < 0)
      return {
        cls: "bg-[var(--crm-red-bg)] text-[var(--crm-red)]",
        icon: "🔴",
        txt: `Quá hạn ${Math.abs(diff)} ngày`,
      };
    if (diff === 0)
      return {
        cls: "bg-[var(--crm-yellow-bg)] text-[var(--crm-yellow)]",
        icon: "🟡",
        txt: "Hôm nay",
      };
    if (diff <= 3)
      return {
        cls: "bg-[var(--crm-yellow-bg)] text-[var(--crm-yellow)]",
        icon: "🟡",
        txt: `Còn ${diff} ngày`,
      };
    return {
      cls: "bg-[var(--crm-green-bg)] text-[var(--crm-green)]",
      icon: "🟢",
      txt: `Còn ${diff} ngày`,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
      {clients.map((c) => {
        const dl = getDlStatus(c.id);
        const tasks = allTasks?.filter((t) => t.client_id === c.id) || [];
        const total = tasks.length;
        const done = tasks.filter((t) => t.status === "done").length;

        return (
          <div
            key={c.id}
            className="group bg-[var(--crm-surface)] rounded-[var(--crm-r-lg)] shadow-[var(--crm-shadow)] border border-[var(--crm-border)] overflow-hidden cursor-pointer transition-all duration-200 hover:translate-y-[-3px] hover:shadow-[var(--crm-shadow-lg)] hover:border-[var(--crm-navy)] flex flex-col"
            onClick={() => navigate(`/admin/crm/${c.id}`)}
          >
            {/* card-head */}
            <div className="bg-[var(--crm-navy)] p-[16px_18px] flex justify-between items-start gap-[8px]">
              <div className="text-white font-[700] text-[16px] line-clamp-1 leading-[1.3]">
                {c.name}
              </div>
              <div className="bg-[rgba(200,150,62,0.25)] text-[var(--crm-gold-light)] px-[10px] py-[3px] rounded-[20px] text-[11px] font-[600] whitespace-nowrap border border-[rgba(200,150,62,0.35)] flex-shrink-0">
                {(c as any).industry_name || "Khác"}
              </div>
            </div>

            {/* card-body */}
            <div className="p-[16px_18px] flex-1">
              <div className="flex justify-between items-center mb-[9px] text-[13px]">
                <span className="text-[var(--crm-text-muted)] font-[500]">
                  Gói dịch vụ
                </span>
                <span className="bg-[#EFF6FF] text-[var(--crm-navy)] px-[10px] py-[2px] rounded-[20px] text-[12px] font-[600]">
                  {c.service_packages?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center mb-[9px] text-[13px]">
                <span className="text-[var(--crm-text-muted)] font-[500]">
                  Chi phí / tháng
                </span>
                <span className="font-[600] text-[var(--crm-gold)] text-right">
                  {new Intl.NumberFormat("vi-VN").format(
                    Number(c.monthly_cost) || 0,
                  )}{" "}
                  ₫
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[var(--crm-text-muted)] font-[500]">
                  Liên hệ
                </span>
                <span className="font-[600] text-[var(--crm-text)] text-right">
                  {c.contact_person || "—"}
                </span>
              </div>
            </div>

            {/* card-foot */}
            <div className="p-[11px_18px] border-t border-[var(--crm-border)] flex justify-between items-center bg-transparent mt-auto">
              {dl ? (
                <span
                  className={`inline-flex items-center gap-[5px] px-[11px] py-[4px] rounded-[20px] text-[12px] font-[600] ${dl.cls}`}
                >
                  {dl.icon} {dl.txt}
                </span>
              ) : (
                <span className="inline-flex items-center gap-[5px] px-[11px] py-[4px] rounded-[20px] text-[12px] font-[600] bg-[var(--crm-bg)] text-[var(--crm-text-muted)]">
                  📅 Chưa có deadline
                </span>
              )}
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-[var(--crm-text-muted)]">
                  {done}/{total} xong
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {clients.length === 0 && (
        <div className="col-span-full py-[80px] text-center text-[var(--crm-text-muted)]">
          <div className="text-[60px] opacity-25 mb-[16px]">📋</div>
          <h3 className="text-[18px] font-[700] text-[var(--crm-text)] mb-[8px]">
            Chưa có khách hàng nào
          </h3>
          <p className="max-w-[300px] mx-auto mb-[24px] text-[14px]">
            Thêm khách hàng đầu tiên để bắt đầu quản lý công việc.
          </p>
        </div>
      )}
    </div>
  );
}
