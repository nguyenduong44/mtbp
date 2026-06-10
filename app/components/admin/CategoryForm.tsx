// app/components/admin/CategoryForm.tsx
import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import { uploadService } from "../../services/uploadService";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Save, Upload, Loader2, Trash2, Info, CheckCircle2, Type, ImageIcon } from "lucide-react";

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

// --- SUB-COMPONENTS (MEMOIZED) ---

const ImagePreview = memo(({ file, fallback }: { file: File | null; fallback: string }) => {
  const [preview, setPreview] = useState<string>(fallback);

  useEffect(() => {
    if (!file) {
      setPreview(fallback);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, fallback]);

  if (!preview && !fallback) return <Upload size={24} className="text-gray-300" />;
  
  return <img src={preview} className="w-full h-full object-contain" alt="Preview" />;
});
ImagePreview.displayName = "ImagePreview";

interface CategoryFormProps {
  initialData?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    bullets: string[] | null;
    icon_url: string | null;
    lucide_icon_name?: string | null;
    display_order: number;
  };
  isEditing?: boolean;
}

export default function CategoryForm({
  initialData,
  isEditing = false,
}: CategoryFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [bulletsText, setBulletsText] = useState(
    initialData?.bullets?.join("\n") || "",
  );
  const [lucideIconName, setLucideIconName] = useState(
    initialData?.lucide_icon_name || "",
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [existingIcon, setExistingIcon] = useState(initialData?.icon_url || "");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
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
    
    let iconUrl = existingIcon;
    if (iconFile) {
      try {
        iconUrl = await uploadService.uploadImage(iconFile);
      } catch (err: any) {
        setError(err.message || "Upload icon thất bại");
        return;
      }
    }
    
    const bullets = bulletsText.split("\n").filter((b) => b.trim());
    const payload = {
      name,
      slug: slug || slugify(name),
      description: description || null,
      bullets: bullets.length ? bullets : null,
      icon_url: iconUrl || null,
      lucide_icon_name: lucideIconName || null,
      display_order: initialData?.display_order || 0,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          updates: payload,
        });
        setSuccessMessage("Đã cập nhật danh mục thành công!");
      } else {
        await createMutation.mutateAsync(payload);
        navigate("/admin/categories");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-white hover:shadow-sm">
            <Link to="/admin/categories">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">/{slug || "danh-muc-moi"}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Info size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên danh mục *</label>
                  <input
                    value={name}
                    onChange={handleNameChange}
                    required
                    placeholder="VD: Quản lý mạng xã hội"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mô tả danh mục</label>
                  <textarea
                    defaultValue={description}
                    onBlur={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Mô tả tóm tắt về danh mục này..."
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-green-50 text-green-600 rounded-2xl">
                  <Type size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Chi tiết dịch vụ</h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Điểm nhấn dịch vụ (mỗi dòng 1 mục)</label>
                <textarea
                  defaultValue={bulletsText}
                  onBlur={(e) => setBulletsText(e.target.value)}
                  rows={6}
                  placeholder="VD:&#10;Chiến lược nội dung&#10;Thiết kế & video ngắn"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none shadow-inner leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 sticky top-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Icon đại diện</h2>
                  <ImageIcon size={14} className="text-gray-300" />
                </div>
                
                <div 
                  className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden group hover:border-gray-900 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center p-6"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <ImagePreview file={iconFile} fallback={existingIcon} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <Upload size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tải ảnh mới</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                
                {existingIcon && !iconFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExistingIcon("")}
                    className="w-full text-red-500 hover:bg-red-50 rounded-xl text-[10px] uppercase font-bold"
                  >
                    <Trash2 size={12} className="mr-1" /> Xóa ảnh hiện tại
                  </Button>
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-50">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lucide Icon Name</label>
                <input
                  value={lucideIconName}
                  onChange={(e) => setLucideIconName(e.target.value)}
                  placeholder="VD: Paintbrush"
                  className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-gray-900 transition-all outline-none"
                />
              </div>

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
                {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Lưu danh mục"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
