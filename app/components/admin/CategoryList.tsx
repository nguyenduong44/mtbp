import { Link } from "react-router";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function CategoryList() {
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  if (isLoading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Danh mục dự án</h1>
          <p className="text-gray-500">
            Các loại hình dịch vụ / danh mục để phân loại project.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/new">
            <Plus size={18} /> Thêm danh mục
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {categories?.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4 hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {cat.icon_url ? (
                <img src={cat.icon_url} className="w-8 h-8 object-contain" />
              ) : (
                <GripVertical size={20} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <span className="text-xs text-gray-400">slug: {cat.slug}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">
                {cat.description}
              </p>
              {cat.bullets && cat.bullets.length > 0 && (
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded">
                    {cat.bullets[0]}
                  </span>
                  {cat.bullets.length > 1 && (
                    <span className="text-[10px] text-gray-400">
                      +{cat.bullets.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/admin/categories/${cat.id}/edit`}>
                  <Edit size={16} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCategory.mutate(cat.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
        {categories?.length === 0 && (
          <div className="py-12 text-center text-gray-500 border-dashed border rounded-2xl">
            Chưa có danh mục nào.
          </div>
        )}
      </div>
    </div>
  );
}
