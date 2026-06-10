import { useState, memo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaItemRow } from "../types";

interface MediaGalleryProps {
  items: MediaItemRow[];
}

// Helper để chuyển đổi các link video thông thường sang link Embed
const getEmbedUrl = (url: string) => {
  if (!url) return "";

  url = url.trim();

  // YouTube Watch
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  // YouTube Shorts
  if (url.includes("youtube.com/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }

  // youtu.be
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }

  // Vimeo
  if (url.includes("vimeo.com/") && !url.includes("player.vimeo.com")) {
    const id = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }

  return url;
};

const getYoutubeThumbnail = (url: string) => {
  if (!url) return "";
  let videoId = "";

  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("/shorts/")) {
    videoId = url.split("/shorts/")[1].split("?")[0];
  }

  if (!videoId) return ""; // Trả về trống nếu không phải link YouTube/Vimeo hỗ trợ id
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Tách nhỏ Item để tối ưu việc re-render và kích hoạt GPU Acceleration
const GalleryItem = memo(
  ({
    item,
    index,
    totalItems,
    onItemClick,
  }: {
    item: MediaItemRow;
    index: number;
    totalItems: number;
    onItemClick: (index: number) => void;
  }) => {
    const isVideo = item.type === "video";
    const thumbnail = isVideo ? getYoutubeThumbnail(item.url) : item.url;

    // Đồng nhất tất cả về 16:9
    const shouldSpanFull = totalItems < 3;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "50px" }}
        transition={{
          delay: (index % 3) * 0.1,
          duration: 0.4,
          ease: "easeOut",
        }}
        className={`group relative overflow-hidden rounded-[2rem] bg-gray-100 border border-gray-100 shadow-sm aspect-video cursor-pointer
        ${shouldSpanFull ? "col-span-full max-w-5xl mx-auto w-full" : ""}`}
        onClick={() => onItemClick(index)}
        style={{ transform: "translateZ(0)" }}
      >
        <img
          src={thumbnail || "/placeholder-video.png"}
          alt={item.caption || "Gallery item"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          style={{ willChange: "transform" }}
        />

        {/* Nút Play cố định cho Video (hiển thị cả khi chưa hover) */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-110">
              <Play className="text-white w-8 h-8 fill-white ml-1 opacity-90" />
            </div>
          </div>
        )}

        {/* Overlay tối giản khi Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center z-20">
          {!isVideo && (
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center border border-white/40 shadow-2xl scale-90 group-hover:scale-100">
              <Plus className="text-white w-6 h-6" />
            </div>
          )}
        </div>

        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium">{item.caption}</p>
          </div>
        )}

        {isVideo && !thumbnail && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
              Video Player
            </span>
          </div>
        )}
      </motion.div>
    );
  },
);

GalleryItem.displayName = "GalleryItem";

const MediaGallery = ({ items }: MediaGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {items.map((item, index) => (
          <GalleryItem
            key={item.id || index}
            item={item}
            index={index}
            totalItems={items.length}
            onItemClick={openLightbox}
          />
        ))}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {lightboxIndex !== null && currentItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-10 touch-none"
                onClick={closeLightbox}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 z-[10000] p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shadow-2xl"
                >
                  <X className="w-8 h-8" />
                </button>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-6xl aspect-video flex flex-col items-center justify-center pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {currentItem.type === "image" ? (
                    <img
                      src={currentItem.url}
                      alt={currentItem.caption || ""}
                      className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(currentItem.url)}
                      className="w-full h-full rounded-2xl shadow-2xl border-0 bg-black"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={currentItem.caption || "Video player"}
                    />
                  )}

                  {currentItem.caption && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-white text-xl font-medium tracking-tight">
                        {currentItem.caption}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default MediaGallery;
