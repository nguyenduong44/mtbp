import { useState } from "react";
import ClientGrid from "./ClientGrid";
import ClientModal from "./ClientModal";
import { Loader2 } from "lucide-react";
import { useClients } from "@/app/hooks/useClients";
import { useAllTasks } from "@/app/hooks/useTasks";
import { useCanViewRevenue } from "@/app/hooks/useCanViewRevenue";

export default function ClientDashboard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "monthly_cost" | "added_at">(
    "name",
  );

  const canViewRevenue = useCanViewRevenue();
  console.log(canViewRevenue);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const { data: clientsData, isLoading } = useClients({
    search,
    page,
    limit: 10,
  });
  const clients = clientsData?.data || [];
  const totalCount = clientsData?.count || 0;

  const { data: allTasks } = useAllTasks();

  // Tính stats
  const totalRevenue =
    clientsData?.data?.reduce((s, c) => s + (Number(c.monthly_cost) || 0), 0) ||
    0;

  const weekDeadlines =
    allTasks?.filter((t) => {
      if (!t.deadline || t.status === "done") return false;
      const d = new Date(t.deadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      return d >= now && d <= nextWeek;
    }).length || 0;

  return (
    <div className="max-w-[1440px] mx-auto space-y-[24px]">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        <StatCard
          label="Tổng khách hàng"
          value={totalCount}
          icon="👥"
          subLabel="đang hợp tác"
          colorClass="blue"
        />
        {canViewRevenue && (
          <StatCard
            label="Doanh thu hàng tháng"
            value={totalRevenue}
            formatCurrency
            icon="💰"
            subLabel="tổng giá trị hợp đồng"
            colorClass="gold"
          />
        )}
        <StatCard
          label="Deadline trong tuần"
          value={weekDeadlines}
          icon="⏰"
          subLabel="công việc sắp đến hạn"
          colorClass="red"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-[12px] items-center">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--crm-text-muted)] pointer-events-none text-[16px]">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-[40px] pr-[16px] py-[10px] bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)] transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-[16px] py-[10px] bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] text-[var(--crm-text)] outline-none cursor-pointer transition-all focus:border-[var(--crm-navy)] focus:ring-[3px] focus:ring-[rgba(26,60,110,0.1)]"
        >
          <option value="deadline">Deadline gần nhất</option>
          <option value="name">Tên A → Z</option>
          <option value="added_at">Mới thêm nhất</option>
          <option value="monthly_cost">Doanh thu cao nhất</option>
        </select>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowModal(true);
          }}
          className="bg-[var(--crm-gold)] hover:bg-[var(--crm-gold-light)] text-white px-[20px] py-[10px] rounded-[var(--crm-r)] text-[14px] font-[600] transition-all active:scale-[0.97] shadow-[0_2px_8px_rgba(200,150,62,0.3)] hover:shadow-[0_4px_12px_rgba(200,150,62,0.4)] whitespace-nowrap"
        >
          ＋ Thêm khách hàng mới
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-[80px]">
          <Loader2 className="animate-spin text-[var(--crm-navy)]" size={40} />
        </div>
      ) : (
        <ClientGrid
          clients={clients}
          onEdit={(c) => {
            setEditingClient(c);
            setShowModal(true);
          }}
        />
      )}

      {/* Pagination */}
      {totalCount > 10 && (
        <div className="flex items-center justify-center mt-[24px] gap-[10px]">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-[20px] py-[10px] bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] font-[600] disabled:opacity-50 hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all active:scale-[0.97]"
          >
            ‹ Trước
          </button>
          <span className="text-[14px] font-[600] text-[var(--crm-text)] px-4">
            Trang {page}
          </span>
          <button
            disabled={page * 10 >= totalCount}
            onClick={() => setPage((p) => p + 1)}
            className="px-[20px] py-[10px] bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[14px] font-[600] disabled:opacity-50 hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all active:scale-[0.97]"
          >
            Sau ›
          </button>
        </div>
      )}

      {/* Modal */}
      <ClientModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
        initialData={editingClient}
        onSuccess={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  formatCurrency = false,
  icon,
  subLabel,
  colorClass,
}: {
  label: string;
  value: number;
  formatCurrency?: boolean;
  icon: string;
  subLabel: string;
  colorClass: "blue" | "gold" | "red";
}) {
  const iconBgs = {
    blue: "bg-[#EFF6FF]",
    gold: "bg-[#FFF7ED]",
    red: "bg-[#FFF1F2]",
  };

  return (
    <div className="bg-[var(--crm-surface)] rounded-[var(--crm-r-lg)] p-[20px_22px] shadow-[var(--crm-shadow)] border border-[var(--crm-border)] flex items-center gap-[16px]">
      <div
        className={`w-[50px] h-[50px] rounded-[12px] flex items-center justify-center text-[24px] flex-shrink-0 ${iconBgs[colorClass]}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-[var(--crm-text-muted)] font-[600] uppercase tracking-[0.5px] mb-[3px]">
          {label}
        </div>
        <div className="text-[26px] font-[800] text-[var(--crm-navy)] leading-none">
          {formatCurrency
            ? new Intl.NumberFormat("vi-VN").format(value)
            : value}
          {formatCurrency && <span className="text-[14px] ml-1">₫</span>}
        </div>
        <div className="text-[12px] text-[var(--crm-text-muted)] mt-[3px]">
          {subLabel}
        </div>
      </div>
    </div>
  );
}
