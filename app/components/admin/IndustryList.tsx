// app/components/admin/IndustryList.tsx
import { useState } from "react";
import { Link } from "react-router";
import { useIndustries, useDeleteIndustry } from "../../hooks/useIndustries";
import { Plus, Edit, Trash2, Briefcase, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function IndustryList() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: industriesData, isLoading, error } = useIndustries({
    page,
    limit
  });
  const deleteIndustry = useDeleteIndustry();

  const industries = industriesData?.data || [];
  const totalCount = industriesData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">Lỗi khi tải ngành nghề: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-left">Ngành nghề khách hàng</h1>
          <p className="text-gray-500 mt-1 text-left">
            Các lĩnh vực hoạt động của đối tác ({totalCount}).
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-lg shadow-gray-200 font-bold">
          <Link to="/admin/industries/new">
            <Plus size={18} className="mr-2" /> Thêm ngành nghề
          </Link>
        </Button>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center min-h-[200px] rounded-3xl">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        )}

        <div className="space-y-4">
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 text-left"
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                <Briefcase size={20} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900">{ind.name}</h3>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">/{ind.slug}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                  {ind.description || "Chưa có mô tả cho ngành nghề này."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild title="Chỉnh sửa" className="h-10 w-10 rounded-xl hover:bg-gray-50">
                  <Link to={`/admin/industries/${ind.id}/edit`}>
                    <Edit size={18} className="text-gray-600" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if(confirm("Xóa ngành nghề này?")) deleteIndustry.mutate(ind.id);
                  }}
                  title="Xóa"
                  className="h-10 w-10 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && industries.length === 0 && (
            <div className="py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem]">
              <p className="text-gray-500 font-medium">Chưa có ngành nghề nào được tạo.</p>
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
