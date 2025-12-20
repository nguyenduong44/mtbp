import { useState } from "react";
import { X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaItem } from "../types";

interface MediaGalleryProps {
  items: MediaItem[];
}

const MediaGallery = ({ items }: MediaGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-200 cursor-pointer ${items.length === 1 ? "col-span-3" : ""}`}
            onClick={() => item.type === "image" && openLightbox(index)}
          >
            {item.type === "image" ? (
              <>
                <img
                  src={item.url}
                  alt={item.caption || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{item.caption}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full h-full">
                <iframe
                  src={item.url}
                  title={item.caption || "Video"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox for Images */}
      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex]?.type === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[lightboxIndex].url}
                alt={items[lightboxIndex].caption || ""}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              {items[lightboxIndex].caption && (
                <div className="mt-4 text-center">
                  <p className="text-white text-lg">
                    {items[lightboxIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaGallery;
