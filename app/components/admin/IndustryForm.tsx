// app/components/admin/IndustryForm.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  useCreateIndustry,
  useUpdateIndustry,
} from "../../hooks/useIndustries";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Save, Loader2, Info, CheckCircle2 } from "lucide-react";

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface IndustryFormProps {
  initialData?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
  };
  isEditing?: boolean;
}

export default function IndustryForm({
  initialData,
  isEditing = false,
}: IndustryFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createMutation = useCreateIndustry();
  const updateMutation = useUpdateIndustry();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!isEditing) setSlug(slugify(newName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    const payload = {
      name,
      slug: slug || slugify(name),
      description: description || null,
      display_order: initialData?.display_order || 0,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          updates: payload,
        });
        setSuccessMessage("Đã cập nhật ngành nghề thành công!");
      } else {
        await createMutation.mutateAsync(payload);
        navigate("/admin/industries");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 px-4 text-left">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-white hover:shadow-sm">
            <Link to="/admin/industries">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 text-left">
              {isEditing ? "Sửa ngành nghề" : "Thêm ngành nghề mới"}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5 text-left">/{slug || "nganh-nghe-moi"}</p>
          </div>
        </div>
        {successMessage && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-8 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 text-left">
              <div className="flex items-center gap-3 mb-2 text-left">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Info size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 text-left">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên ngành nghề *</label>
                  <input
                    value={name}
                    onChange={handleNameChange}
                    required
                    placeholder="VD: Thời trang & May mặc"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mô tả ngành nghề</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Mô tả tóm tắt về lĩnh vực này..."
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 sticky top-8 text-left">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-7 rounded-2xl shadow-xl shadow-gray-200 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Lưu ngành nghề"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/admin/industries")}
                className="w-full py-3 rounded-2xl text-xs font-bold text-gray-400 hover:text-gray-900"
              >
                Hủy thay đổi
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
