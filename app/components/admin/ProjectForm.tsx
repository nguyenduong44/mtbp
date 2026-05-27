// app/components/admin/ProjectForm.tsx
import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router";
import { useCreateProject, useUpdateProject } from "../../hooks/useProjects";
import { useClients } from "../../hooks/useClients";
import { useCategories } from "../../hooks/useCategories";
import { Button } from "../../../components/ui/button";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Video,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Link as LinkIcon,
  Star,
  Info,
} from "lucide-react";

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

// --- TỐI ƯU PREVIEW ẢNH ---
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
        className="w-full h-full object-cover" 
        alt="Preview" 
        loading="lazy"
        style={{ transform: 'translateZ(0)' }}
      />
    );
  },
);

// --- TỐI ƯU MEDIA ITEM ---
const MediaItemView = memo(({ item, onRemove }: any) => {
  const [localUrl, setLocalUrl] = useState(item.url);

  useEffect(() => {
    if (item.file) {
      const url = URL.createObjectURL(item.file);
      setLocalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.file]);

  return (
    <div 
      className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      {item.type === "image" ? (
        <img
          src={item.file ? localUrl : item.url}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          alt=""
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
          <Video size={24} className="opacity-50" />
          <span className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-50">
            Video
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
});

// --- TỐI ƯU CÁC CARD LỚN ---
const BasicInfoCard = memo(
  ({
    title,
    onTitleChange,
    clientId,
    setClientId,
    clients,
    categories,
    selectedCategoryIds,
    onCategoryToggle,
    overview,
    setOverview,
  }: any) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
          <Info size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Tên dự án *
          </label>
          <input
            defaultValue={title}
            onBlur={(e) => onTitleChange(e.target.value)}
            placeholder="Nhập tên dự án..."
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Khách hàng
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 outline-none appearance-none shadow-inner"
          >
            <option value="">-- Chọn khách hàng --</option>
            {clients?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Danh mục sản phẩm
          </label>
          <div className="flex flex-wrap gap-2 p-1">
            {categories?.map((cat: any) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border cursor-pointer transition-all ${selectedCategoryIds.includes(cat.id) ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-200" : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"}`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => onCategoryToggle(cat.id)}
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Tổng quan dự án
          </label>
          <textarea
            defaultValue={overview}
            onBlur={(e) => setOverview(e.target.value)}
            rows={3}
            placeholder="Mô tả tóm tắt..."
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  ),
  (prev, next) =>
    prev.title === next.title &&
    prev.clientId === next.clientId &&
    prev.selectedCategoryIds === next.selectedCategoryIds &&
    prev.clients === next.clients &&
    prev.categories === next.categories,
);

const ImplementationCard = memo(
  ({ scopeText, setScopeText, resultsText, setResultsText }: any) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-green-50 text-green-600 rounded-2xl">
          <CheckCircle2 size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chi tiết thực hiện</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Phạm vi công việc
          </label>
          <textarea
            defaultValue={scopeText}
            onBlur={(e) => setScopeText(e.target.value)}
            rows={6}
            placeholder="Mỗi dòng 1 gạch đầu dòng..."
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 outline-none leading-relaxed"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Kết quả đạt được
          </label>
          <textarea
            defaultValue={resultsText}
            onBlur={(e) => setResultsText(e.target.value)}
            rows={6}
            placeholder="Mỗi dòng 1 gạch đầu dòng..."
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  ),
);

const MediaGalleryCard = memo(
  ({
    sections,
    addSection,
    removeSection,
    updateSectionTitle,
    addMediaItem,
    removeMediaItem,
  }: any) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
            <ImageIcon size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Thư viện Media</h2>
        </div>
        <Button
          type="button"
          onClick={addSection}
          variant="outline"
          className="rounded-xl border-gray-200"
        >
          <Plus size={16} className="mr-2" /> Thêm Section
        </Button>
      </div>
      {sections.map((sec: any, secIdx: number) => (
        <div
          key={sec.id || secIdx}
          className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-6"
        >
          <div className="p-4 bg-gray-50/50 border-b flex items-center justify-between">
            <input
              defaultValue={sec.title}
              onBlur={(e) => updateSectionTitle(secIdx, e.target.value)}
              placeholder="Tên section..."
              className="font-bold bg-transparent border-b border-dashed border-gray-200 focus:border-gray-900 outline-none text-sm px-2 py-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSection(secIdx)}
              className="text-red-500 rounded-xl"
            >
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
              {sec.items.map((item: any, itemIdx: number) => (
                <MediaItemView
                  key={item.id || itemIdx}
                  item={item}
                  onRemove={() => removeMediaItem(secIdx, itemIdx)}
                />
              ))}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:border-gray-900 hover:bg-white transition-all relative cursor-pointer">
                <Upload size={24} className="text-gray-300 mb-1" />
                <span className="text-[10px] font-bold uppercase text-gray-400">
                  Tải ảnh
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addMediaItem(secIdx, "image", file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center bg-gray-900 p-2 pl-4 rounded-2xl">
              <Video size={16} className="text-gray-400" />
              <input
                id={`vid-url-${secIdx}`}
                placeholder="Thêm video URL..."
                className="flex-1 bg-transparent border-none text-xs text-white focus:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.currentTarget.value;
                    if (val) {
                      addMediaItem(secIdx, "video", undefined, val);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl h-8"
                onClick={() => {
                  const el = document.getElementById(
                    `vid-url-${secIdx}`,
                  ) as HTMLInputElement;
                  if (el.value) {
                    addMediaItem(secIdx, "video", undefined, el.value);
                    el.value = "";
                  }
                }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  (p, n) => p.sections === n.sections,
);

const SocialLinksCard = memo(
  ({ socialLinks, addSocialLink, updateSocialLink, removeSocialLink }: any) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <LinkIcon size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-gray-900 uppercase">
            Social Links
          </h3>
        </div>
        <Button
          type="button"
          onClick={addSocialLink}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-gray-50 hover:bg-white border border-gray-100"
        >
          <Plus size={14} />
        </Button>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {socialLinks.map((link: any, idx: number) => (
          <div
            key={idx}
            className="p-4 bg-gray-50 rounded-2xl space-y-2 relative group"
          >
            <button
              type="button"
              onClick={() => removeSocialLink(idx)}
              className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
            <select
              value={link.platform}
              onChange={(e) =>
                updateSocialLink(idx, "platform", e.target.value)
              }
              className="w-full bg-transparent border-none text-[10px] font-black uppercase tracking-widest p-0 focus:ring-0 text-gray-400"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="other">Website / Khác</option>
            </select>
            <input
              placeholder="Link dự án..."
              defaultValue={link.url}
              onBlur={(e) => updateSocialLink(idx, "url", e.target.value)}
              className="w-full bg-white px-3 py-2 rounded-xl text-[11px] border border-gray-100 outline-none"
            />
            <input
              placeholder="Nhãn (VD: Fanpage)"
              defaultValue={link.label || ""}
              onBlur={(e) => updateSocialLink(idx, "label", e.target.value)}
              className="w-full bg-white px-3 py-2 rounded-xl text-[11px] border border-gray-100 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  ),
  (p, n) => p.socialLinks === n.socialLinks,
);

// --- COMPONENT CHÍNH ---
export default function ProjectForm({
  initialData,
  isEditing = false,
}: {
  initialData?: any;
  isEditing?: boolean;
}) {
  const navigate = useNavigate();
  const { data: clients } = useClients();
  const { data: categories } = useCategories();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [clientId, setClientId] = useState(
    initialData?.client_id?.toString() || "",
  );
  const [overview, setOverview] = useState(initialData?.overview || "");
  const [scopeText, setScopeText] = useState(
    initialData?.scope?.join("\n") || "",
  );
  const [resultsText, setResultsText] = useState(
    initialData?.results?.join("\n") || "",
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingThumbnail] = useState(initialData?.thumbnail || "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    initialData?.categories?.map((c: any) => c.id) || [],
  );
  const [sections, setSections] = useState<any[]>(
    initialData?.media_sections?.map((s: any) => ({
      id: s.id,
      title: s.title || "",
      items: s.media_items || [],
      _isNew: false,
    })) || [],
  );
  const [socialLinks, setSocialLinks] = useState<any[]>(
    initialData?.social_links?.map((l: any) => ({
      id: l.id,
      platform: l.platform,
      url: l.url,
      label: l.label,
      _isNew: false,
    })) || [],
  );

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onTitleChange = useCallback(
    (val: string) => {
      setTitle(val);
      if (!isEditing) setSlug(slugify(val));
    },
    [isEditing],
  );

  const onCategoryToggle = useCallback((id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const addSection = useCallback(
    () =>
      setSections((prev) => [
        ...prev,
        { id: `new-${Date.now()}`, title: "", items: [], _isNew: true },
      ]),
    [],
  );
  const removeSection = useCallback(
    (idx: number) => setSections((prev) => prev.filter((_, i) => i !== idx)),
    [],
  );
  const updateSectionTitle = useCallback(
    (idx: number, t: string) =>
      setSections((prev) => {
        const c = [...prev];
        c[idx] = { ...c[idx], title: t };
        return c;
      }),
    [],
  );
  const addMediaItem = useCallback(
    (idx: number, type: string, file?: File, url?: string, cap?: string) =>
      setSections((prev) => {
        const c = [...prev];
        const newItems = [
          ...c[idx].items,
          {
            type,
            url: type === "image" ? "" : url || "",
            caption: cap || null,
            file,
            _isNew: true,
          },
        ];
        c[idx] = { ...c[idx], items: newItems };
        return c;
      }),
    [],
  );
  const removeMediaItem = useCallback(
    (sIdx: number, iIdx: number) =>
      setSections((prev) => {
        const c = [...prev];
        const newItems = c[sIdx].items.filter(
          (_: any, i: number) => i !== iIdx,
        );
        c[sIdx] = { ...c[sIdx], items: newItems };
        return c;
      }),
    [],
  );

  const addSocialLink = useCallback(
    () =>
      setSocialLinks((prev) => [
        ...prev,
        {
          id: Date.now(),
          platform: "facebook",
          url: "",
          label: "",
          _isNew: true,
        },
      ]),
    [],
  );
  const updateSocialLink = useCallback(
    (idx: number, f: string, v: string) =>
      setSocialLinks((prev) => {
        const c = [...prev];
        c[idx] = { ...c[idx], [f]: v };
        return c;
      }),
    [],
  );
  const removeSocialLink = useCallback(
    (idx: number) => setSocialLinks((prev) => prev.filter((_, i) => i !== idx)),
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const payload = {
      title,
      slug,
      client_id: clientId ? parseInt(clientId) : null,
      overview,
      scope: scopeText.split("\n").filter((s) => s.trim()),
      results: resultsText.split("\n").filter((s) => s.trim()),
      featured,
      thumbnail: existingThumbnail,
      thumbnailFile,
    };
    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: {
            project: payload,
            categoryIds: selectedCategoryIds,
            mediaSections: sections,
            socialLinks,
          },
        });
        setSuccessMessage("Đã cập nhật dự án thành công!");
      } else {
        await createMutation.mutateAsync({
          project: payload,
          categoryIds: selectedCategoryIds,
          mediaSections: sections,
          socialLinks,
        });
        navigate("/admin/projects");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-xl hover:bg-white hover:shadow-sm"
          >
            <Link to="/admin/projects">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Sửa dự án" : "Thêm dự án mới"}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">
              /{slug || "du-an-moi"}
            </p>
          </div>
        </div>
        {successMessage && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 text-left">
            <BasicInfoCard
              title={title}
              onTitleChange={onTitleChange}
              clientId={clientId}
              setClientId={setClientId}
              clients={clients}
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
              onCategoryToggle={onCategoryToggle}
              overview={overview}
              setOverview={setOverview}
            />
            <ImplementationCard
              scopeText={scopeText}
              setScopeText={setScopeText}
              resultsText={resultsText}
              setResultsText={setResultsText}
            />
            <MediaGalleryCard
              sections={sections}
              addSection={addSection}
              removeSection={removeSection}
              updateSectionTitle={updateSectionTitle}
              addMediaItem={addMediaItem}
              removeMediaItem={removeMediaItem}
            />
          </div>

          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 sticky top-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Ảnh đại diện
                  </h2>
                  <ImageIcon size={14} className="text-gray-300" />
                </div>
                <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden group hover:border-gray-900 transition-all cursor-pointer shadow-inner">
                  <ImagePreview
                    file={thumbnailFile}
                    fallback={existingThumbnail}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <Upload size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Thay đổi ảnh
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] || null)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-900 uppercase">
                    Nổi bật
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-amber-200 text-amber-600 cursor-pointer"
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
                {isSubmitting
                  ? "Đang lưu..."
                  : isEditing
                    ? "Cập nhật dự án"
                    : "Lưu dự án mới"}
              </Button>
              <hr className="border-gray-50" />
              <SocialLinksCard
                socialLinks={socialLinks}
                addSocialLink={addSocialLink}
                updateSocialLink={updateSocialLink}
                removeSocialLink={removeSocialLink}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
