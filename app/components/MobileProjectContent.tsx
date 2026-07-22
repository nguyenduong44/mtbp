import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Play, X } from "lucide-react";

import Container from "./Container";

type MobileProjectContentProps = {
  work: any;
};

const getEmbedUrl = (url: string) => {
  if (!url) return "";

  const cleanUrl = url.trim();

  if (cleanUrl.includes("youtube.com/embed/")) {
    return cleanUrl;
  }

  if (cleanUrl.includes("youtube.com/watch?v=")) {
    const id = cleanUrl.split("watch?v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (cleanUrl.includes("youtube.com/shorts/")) {
    const id = cleanUrl.split("/shorts/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (cleanUrl.includes("youtu.be/")) {
    const id = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (
    cleanUrl.includes("vimeo.com/") &&
    !cleanUrl.includes("player.vimeo.com")
  ) {
    const id = cleanUrl.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}`;
  }

  return cleanUrl;
};

const getVideoThumbnail = (url: string) => {
  if (!url) return "";

  let videoId = "";

  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("/shorts/")) {
    videoId = url.split("/shorts/")[1]?.split("?")[0];
  } else if (url.includes("/embed/")) {
    videoId = url.split("/embed/")[1]?.split("?")[0];
  }

  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

export default function MobileProjectContent({
  work,
}: MobileProjectContentProps) {
  const sections =
    work.media_sections?.filter(
      (section: any) => section.media_items?.length > 0,
    ) || [];

  const allMediaItems = useMemo(
    () => sections.flatMap((section: any) => section.media_items || []),
    [sections],
  );

  const featuredMedia =
    allMediaItems.find((item: any) => item.type === "video") ||
    allMediaItems[0];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  const activeSection = sections[activeSectionIndex];
  const activeItems = activeSection?.media_items || [];

  const changeSection = (index: number) => {
    setActiveSectionIndex(index);
  };

  return (
    <>
      <Container>
        {/* Video hoặc media đầu tiên */}
        {featuredMedia && (
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setLightboxItem(featuredMedia)}
              className="
        relative mx-auto block
        w-full
        overflow-hidden rounded-[20px]
        bg-primary text-left shadow-sm
      "
            >
              {featuredMedia.type === "video" ? (
                <>
                  <img
                    src={
                      getVideoThumbnail(featuredMedia.url) ||
                      "/placeholder-video.png"
                    }
                    alt={featuredMedia.caption || "Video nổi bật"}
                    draggable={false}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder-video.png";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                      <Play className="ml-0.5 size-5 fill-primary" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={featuredMedia.url}
                    alt={featuredMedia.caption || work.title}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </>
              )}

              {featuredMedia.caption && (
                <div className="absolute inset-x-0 bottom-0 z-10 p-3">
                  <p className="line-clamp-2 text-xs font-semibold leading-4 text-white">
                    {featuredMedia.caption}
                  </p>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Kết quả đạt được */}
        {work.results?.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-conthrax text-xl font-bold text-gray-900">
              Kết quả đạt được
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {work.results.map((result: string, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="mb-3 size-5 text-primary" />

                  <p className="text-sm font-semibold leading-5 text-gray-800">
                    {result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tổng quan và giải pháp */}
        {(work.overview || work.solution) && (
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-3">
              {work.overview && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <h2 className="mb-3 text-sm font-bold text-gray-900">
                    Tổng quan & vấn đề
                  </h2>

                  <p className="text-xs leading-5 text-gray-600">
                    {work.overview}
                  </p>
                </div>
              )}

              {work.solution && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <h2 className="mb-3 text-sm font-bold text-gray-900">
                    Giải pháp thực hiện
                  </h2>

                  <p className="text-xs leading-5 text-gray-600">
                    {work.solution}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phạm vi công việc */}
        {work.scope?.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-conthrax text-xl font-bold text-gray-900">
              Phạm vi công việc
            </h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {work.scope.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

                  <span className="leading-5">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery mobile */}
        {sections.length > 0 && (
          <div className="px-4">
            <h2 className="mb-4 font-conthrax text-xl font-bold text-gray-900">
              Thư viện dự án
            </h2>

            {/* Tên section thành các button */}
            <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sections.map((section: any, index: number) => (
                <button
                  key={section.id || index}
                  type="button"
                  onClick={() => changeSection(index)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeSectionIndex === index
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {/* Carousel */}
            {/* Gallery vuốt ngang */}
            <div
              className="
    -mx-4 overflow-x-auto px-4 pb-3
    snap-x snap-mandatory
    overscroll-x-contain
    scroll-smooth
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
            >
              <div className="flex gap-3">
                {activeItems.map((item: any, index: number) => {
                  const isVideo = item.type === "video";

                  return (
                    <motion.button
                      key={item.id || index}
                      type="button"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      onClick={() => setLightboxItem(item)}
                      className="
            relative
            w-[31%]
            min-w-[31%]
            shrink-0
            snap-start
            overflow-hidden
            rounded-[16px]
            bg-primary
            text-left
            aspect-[9/16]
            shadow-sm
          "
                    >
                      {isVideo ? (
                        <>
                          <img
                            src={
                              getVideoThumbnail(item.url) ||
                              "/placeholder-video.png"
                            }
                            alt={item.caption || "Video dự án"}
                            draggable={false}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-primary/35" />

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                              <Play className="ml-0.5 size-5 fill-primary" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.url}
                            alt={item.caption || "Hình ảnh dự án"}
                            draggable={false}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        </>
                      )}

                      {item.caption && (
                        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
                          <p className="line-clamp-2 text-xs font-semibold leading-4 text-white">
                            {item.caption}
                          </p>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* Lightbox mobile */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:hidden"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full"
            >
              {lightboxItem.type === "video" ? (
                <iframe
                  src={getEmbedUrl(lightboxItem.url)}
                  title={lightboxItem.caption || "Video dự án"}
                  className="aspect-video w-full rounded-2xl border-0 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.caption || ""}
                  className="max-h-[85vh] w-full rounded-2xl object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
