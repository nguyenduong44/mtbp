import { useState } from "react";
import { useBusinessTypes } from "../../hooks/useBusinessTypes";
import { useServicePackages } from "../../hooks/useServicePackages";
import { useTasks } from "../../hooks/useTasks";
import ClientGrid from "./ClientGrid";
import ClientModal from "./ClientModal";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

export default function ClientDashboard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "monthly_cost" | "added_at">(
    "name",
  );
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const { data, isLoading } = useClients({ search, sortBy, page, limit: 10 });
  const clients = data?.data || [];
  const totalCount = data?.count || 0;

  // Tính tổng doanh thu và số deadline sắp tới (cần gọi thêm tasks, nhưng để đơn giản có thể tính phía client)
  // Hoặc dùng view trong Supabase để lấy stats.

  return (
    <div>
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Tổng khách hàng" value={totalCount} />
        <StatCard
          label="Doanh thu tháng"
          value={clients.reduce((s, c) => s + (Number(c.monthly_cost) || 0), 0)}
          formatCurrency
        />
        <StatCard label="Deadline trong tuần" value={0} />{" "}
        {/* cần tính từ tasks */}
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded px-4 py-2"
        >
          <option value="name">Tên A→Z</option>
          <option value="monthly_cost">Doanh thu cao nhất</option>
          <option value="added_at">Mới thêm nhất</option>
        </select>
        <Button
          onClick={() => {
            setEditingClient(null);
            setShowModal(true);
          }}
        >
          ＋ Thêm khách hàng
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin" />
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
        <div className="flex justify-center mt-6 gap-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹
          </Button>
          <span className="py-2">Trang {page}</span>
          <Button
            disabled={page * 10 >= totalCount}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </Button>
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
}: {
  label: string;
  value: number;
  formatCurrency?: boolean;
}) {
  return (
    <div className="bg-white p-4 rounded shadow border">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">
        {formatCurrency
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value)
          : value}
      </div>
    </div>
  );
}
