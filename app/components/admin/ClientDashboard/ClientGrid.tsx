import type { ClientRow } from "@/app/types";
import { Link } from "react-router";

export default function ClientGrid({
  clients,
  onEdit,
}: {
  clients: ClientRow[];
  onEdit: (c: ClientRow) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((c) => (
        <div
          key={c.id}
          className="bg-white rounded-lg shadow border hover:shadow-md transition cursor-pointer"
          onClick={() => onEdit(c)}
        >
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div className="font-bold truncate">{c.name}</div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {c.business_types?.name}
            </span>
          </div>
          <div className="p-4 space-y-2">
            <div>
              <span className="text-gray-500">Gói:</span>{" "}
              {c.service_packages?.name}
            </div>
            <div>
              <span className="text-gray-500">Liên hệ:</span> {c.contact_person}
            </div>
            <div>
              <span className="text-gray-500">Chi phí:</span>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(c.monthly_cost) || 0)}
            </div>
          </div>
          <div className="p-3 border-t flex justify-between text-sm text-gray-400">
            <span>
              📅{" "}
              {c.contract_start_date
                ? new Date(c.contract_start_date).toLocaleDateString("vi-VN")
                : "—"}
            </span>
            <Link
              to={`/admin/clients/${c.id}`}
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
