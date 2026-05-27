// app/components/admin/ProjectList.tsx
import { useState } from "react";
import { Link } from "react-router";
import { useProjects, useDeleteProject } from "../../hooks/useProjects";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Palette,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ProjectList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const { data, isLoading, error } = useProjects(page, limit);
  const deleteProject = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState("");

  const projects = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      deleteProject.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">
          Lỗi khi tải dự án: {error.message}
        </p>
      </div>
    );
  }

  const filtered = projects?.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dự án</h1>
          <p className="text-gray-500 mt-1">
            Quản lý các sản phẩm trong portfolio của MTBP ({totalCount} dự án).
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-lg shadow-gray-200">
          <Link to="/admin/projects/new">
            <Plus size={18} className="mr-2" /> Thêm dự án mới
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm trong trang này..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Thông tin dự án
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.map((p) => (
                <tr
                  key={p.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Palette size={20} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 truncate">
                            {p.title || "Chưa đặt tên"}
                          </p>
                          {p.featured && (
                            <Star
                              size={14}
                              className="text-amber-500 fill-amber-500 flex-shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
                          /{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {p.clients?.name || (
                          <span className="text-gray-300 italic">
                            Chưa chọn client
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Chỉnh sửa"
                        className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"
                      >
                        <Link to={`/admin/projects/${p.id}/edit`}>
                          <Edit size={16} className="text-gray-600" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Xem trên web"
                        className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all text-blue-500"
                      >
                        <a
                          href={`/works/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Eye size={16} />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        title="Xóa dự án"
                        className="h-9 w-9 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-300">
                        <Search size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Không tìm thấy dự án nào
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Thử thay đổi từ khóa tìm kiếm của bạn
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Trang {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  setPage(page - 1);
                  window.scrollTo(0, 0);
                }}
                className="rounded-lg h-8 w-8 p-0"
              >
                <ChevronLeft size={14} />
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo(0, 0);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
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
                disabled={page >= totalPages}
                onClick={() => {
                  setPage(page + 1);
                  window.scrollTo(0, 0);
                }}
                className="rounded-lg h-8 w-8 p-0"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
