// app/components/admin/ClientList.tsx
import { useState } from "react";
import { Link } from "react-router";
import { useClients, useDeleteClient } from "../../hooks/useClients";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ClientList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const {
    data: clientsData,
    isLoading,
    error,
  } = useClients({
    page,
    limit,
    search: searchTerm,
  });
  const deleteClient = useDeleteClient();

  const clients = clientsData?.data || [];
  const totalCount = clientsData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">
          Lỗi khi tải khách hàng: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-500 mt-1">
            Quản lý danh sách khách hàng và đối tác ({totalCount}).
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-lg shadow-gray-200">
          <Link to="/admin/clients/new">
            <Plus size={18} className="mr-2" /> Thêm mới
          </Link>
        </Button>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset về trang 1 khi tìm kiếm
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
        />
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center min-h-[200px] rounded-3xl">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              style={{ transform: "translateZ(0)", willChange: "transform" }}
            >
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 p-2 relative">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Building2 size={24} className="text-gray-300" />
                  )}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Chỉnh sửa"
                    className="h-9 w-9 rounded-xl hover:bg-gray-50"
                  >
                    <Link to={`/admin/clients/${client.id}/edit`}>
                      <Edit size={16} className="text-gray-600" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Xóa khách hàng này?"))
                        deleteClient.mutate(client.id);
                    }}
                    title="Xóa"
                    className="h-9 w-9 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <h3 className="font-bold mt-4 text-gray-900 text-lg">
                {client.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-medium">
                {(client as any).industry_name || "Chưa cập nhật ngành nghề"}
              </p>
            </div>
          ))}
          {!isLoading && clients.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">
                Không tìm thấy khách hàng nào.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium ml-2">
            Trang {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => {
                setPage(page - 1);
                window.scrollTo(0, 0);
              }}
              className="rounded-lg h-9 w-9 p-0"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo(0, 0);
                  }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1
                      ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => {
                setPage(page + 1);
                window.scrollTo(0, 0);
              }}
              className="rounded-lg h-9 w-9 p-0"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
