import { useParams } from "react-router";
import { useCategory } from "../hooks/useCategories";
import CategoryForm from "../components/admin/CategoryForm";
import { Loader2 } from "lucide-react";

export default function EditCategory() {
  const { id } = useParams();
  const { data: category, isLoading, error } = useCategory(Number(id));

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
    
  if (error || !category)
    return <div className="text-center py-20 text-gray-500 font-medium">Không tìm thấy danh mục.</div>;

  return <CategoryForm initialData={category} isEditing={true} />;
}
