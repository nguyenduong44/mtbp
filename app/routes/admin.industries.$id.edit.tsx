import { useParams } from "react-router";
import { useIndustry } from "../hooks/useIndustries";
import IndustryForm from "../components/admin/IndustryForm";
import { Loader2 } from "lucide-react";

export default function EditIndustry() {
  const { id } = useParams();
  const { data: industry, isLoading, error } = useIndustry(Number(id));

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
    
  if (error || !industry)
    return <div className="text-center py-20 text-gray-500 font-medium">Không tìm thấy ngành nghề.</div>;

  return <IndustryForm initialData={industry} isEditing={true} />;
}
