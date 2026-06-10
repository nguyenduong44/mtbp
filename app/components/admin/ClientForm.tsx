// app/components/admin/ClientForm.tsx
import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router";
import { useCreateClient, useUpdateClient } from "../../hooks/useClients";
import { uploadService } from "../../services/uploadService";
import { Button } from "../../../components/ui/button";
import {
  ArrowLeft,
  Save,
  Upload,
  Loader2,
  Info,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useIndustries } from "../../hooks/useIndustries";

// --- SUB-COMPONENTS (MEMOIZED) ---

const ImagePreview = memo(
  ({ file, fallback }: { file: File | null; fallback: string }) => {
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

    if (!preview && !fallback)
      return <Upload size={24} className="text-gray-300" />;

    return (
      <img
        src={preview}
        className="w-full h-full object-contain"
        alt="Preview"
      />
    );
  },
);
ImagePreview.displayName = "ImagePreview";

interface ClientFormProps {
  initialData?: {
    id: number;
    name: string;
    industry_id: number | null;
    logo: string | null;
  };
  isEditing?: boolean;
}

export default function ClientForm({
  initialData,
  isEditing = false,
}: ClientFormProps) {
  const navigate = useNavigate();
  const { data: industriesData } = useIndustries({ limit: 100 });
  const industries = industriesData?.data || [];

  const [name, setName] = useState(initialData?.name || "");
  const [industryId, setIndustryId] = useState<string>(
    initialData?.industry_id?.toString() || "",
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogo, setExistingLogo] = useState(initialData?.logo || "");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    let logoUrl = existingLogo;
    if (logoFile) {
      try {
        logoUrl = await uploadService.uploadImage(logoFile);
      } catch (err: any) {
        setError(err.message || "Upload logo thất bại");
        return;
      }
    }

    const payload = { 
      name, 
      industry_id: industryId ? parseInt(industryId) : null, 
      logo: logoUrl || null 
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          updates: payload,
        });
        setSuccessMessage("Đã cập nhật khách hàng thành công!");
      } else {
        await createMutation.mutateAsync(payload);
        navigate("/admin/clients");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-4 text-left">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-xl hover:bg-white hover:shadow-sm"
          >
            <Link to="/admin/clients">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Sửa khách hàng" : "Thêm khách hàng mới"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? `ID: ${initialData?.id}` : "Thông tin đối tác mới"}
            </p>
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
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Info size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Thông tin cơ bản
                </h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Tên khách hàng *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="VD: Công ty TNHH MTBP"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Ngành nghề
                  </label>
                  <select
                    value={industryId}
                    onChange={(e) => setIndustryId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 outline-none appearance-none shadow-inner cursor-pointer"
                  >
                    <option value="">-- Chọn ngành nghề --</option>
                    {industries.map((ind: any) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 sticky top-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Logo khách hàng
                  </h2>
                  <Building2 size={14} className="text-gray-300" />
                </div>

                <div
                  className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden group hover:border-gray-900 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center p-8"
                  style={{ transform: "translateZ(0)" }}
                >
                  <ImagePreview file={logoFile} fallback={existingLogo} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                    <Upload size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Tải logo mới
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 text-center italic">
                  Kích thước khuyên dùng: 200x200px (1:1)
                </p>
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
                {isSubmitting
                  ? "Đang lưu..."
                  : isEditing
                    ? "Cập nhật"
                    : "Lưu khách hàng"}
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/admin/clients")}
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
