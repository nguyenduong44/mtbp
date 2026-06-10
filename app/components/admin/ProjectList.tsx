// app/components/admin/ProjectList.tsx
import { useEffect, useState } from "react";
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
  Filter,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useClients } from "@/app/hooks/useClients";
import { useCategories } from "@/app/hooks/useCategories";
import { Badge } from "@/components/ui/badge";

export default function ProjectList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [clientId, setClientId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [featured, setFeatured] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<"created_at" | "title">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const limit = 10;

  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjects({
    page,
    limit,
    search,
    clientId,
    categoryId,
    featured,
    sortBy,
    sortOrder,
  });

  // Tăng limit để lấy được nhiều options cho bộ lọc
  const { data: clientsData } = useClients({ limit: 100 });
  const { data: categoriesData } = useCategories({ limit: 100 });

  const projects = projectsData?.data || [];
  const clients = clientsData?.data || [];
  const categories = categoriesData?.data || [];

  const totalCount = projectsData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Reset page về 1 khi thay đổi filter
  useEffect(() => {
    setPage(1);
  }, [search, clientId, categoryId, featured, sortBy, sortOrder]);

  const deleteProject = useDeleteProject();

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      deleteProject.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">
          Lỗi khi tải dự án: {error.message}
        </p>
      </div>
    );
  }

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

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Bộ lọc dự án
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tên dự án, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
          </div>

          <select
            value={clientId || ""}
            onChange={(e) =>
              setClientId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none appearance-none"
          >
            <option value="">Tất cả khách hàng</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={categoryId || ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none appearance-none"
          >
            <option value="">Tất cả danh mục</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={featured === null ? "" : featured.toString()}
            onChange={(e) =>
              setFeatured(
                e.target.value === "" ? null : e.target.value === "true",
              )
            }
            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none appearance-none"
          >
            <option value="">Mọi trạng thái</option>
            <option value="true">Chỉ dự án nổi bật</option>
            <option value="false">Dự án thông thường</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">
                Sắp xếp theo:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-bold text-gray-700 focus:ring-0 cursor-pointer p-0"
              >
                <option value="created_at">Ngày tạo</option>
                <option value="title">Tên dự án</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors"
            >
              <ArrowUpDown size={14} />
              {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
            </button>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setClientId(null);
              setCategoryId(null);
              setFeatured(null);
              setSortBy("created_at");
              setSortOrder("desc");
            }}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        )}

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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((p) => (
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
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {p.categories?.length > 0 ? (
                        p.categories.map((cat: any, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-gray-100 text-gray-600 border-none text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg"
                          >
                            {cat.name || "N/A"}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-300 text-xs italic">
                          Chưa có
                        </span>
                      )}
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
              {!isLoading && projects.length === 0 && (
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
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 font-medium">
              Trang {page} / {totalPages || 1}
            </p>
            <p className="text-[10px] text-gray-400">
              Tổng cộng {totalCount} dự án
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => {
                setPage(page - 1);
                window.scrollTo(0, 0);
              }}
              className="rounded-lg h-8 w-8 p-0"
            >
              <ChevronLeft size={14} />
            </Button>
            <div className="flex items-center gap-1">
              {totalPages > 0 ? (
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    disabled={isLoading}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === i + 1
                        ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                        : "bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <button className="w-8 h-8 rounded-lg text-xs font-bold bg-gray-900 text-white">
                  1
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
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
      </div>
    </div>
  );
}
