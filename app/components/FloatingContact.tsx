import { useState, useEffect } from "react";
import { Phone, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingContact() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      <AnimatePresence>
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            onClick={scrollToTop}
            className="
              group relative flex items-center justify-center
              w-12 h-12
              bg-white/90 dark:bg-slate-900/90
              text-slate-800 dark:text-slate-100
              rounded-full
              shadow-lg hover:shadow-xl
              border border-gray-300
              cursor-pointer
              transition-colors duration-300
              hover:bg-slate-50 dark:hover:bg-slate-800
            "
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp size={20} className="stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Zalo Button */}
      <motion.a
        href="https://zalo.me/0961079252"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ qua Zalo"
        className="
          group relative flex items-center justify-center
          w-12 h-12
          bg-[#0068ff]
          text-white
          rounded-full
          shadow-lg hover:shadow-xl
          transition-shadow duration-300
        "
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="/zalo.png"
          alt="Zalo"
          className="w-7 h-7 object-contain rounded-full"
        />
        <span
          className="
          absolute right-16 top-1/2 -translate-y-1/2
          px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
          bg-slate-900/95 dark:bg-slate-950/95 text-white
          border border-slate-800/80 dark:border-slate-800
          shadow-md opacity-0 scale-95 origin-right pointer-events-none
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-200
        "
        >
          Chat Zalo
        </span>
      </motion.a>

      {/* Hotline / Phone Button */}
      <motion.a
        href="tel:0939030601"
        aria-label="Gọi hotline"
        className="
          group relative flex items-center justify-center
          w-12 h-12
          bg-emerald-600
          text-white
          rounded-full
          shadow-lg hover:shadow-xl
          transition-shadow duration-300
        "
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 rounded-full bg-emerald-600/30 animate-ping pointer-events-none" />
        <Phone size={20} className="fill-current" />
        <span
          className="
          absolute right-16 top-1/2 -translate-y-1/2
          px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
          bg-slate-900/95 dark:bg-slate-950/95 text-white
          border border-slate-800/80 dark:border-slate-800
          shadow-md opacity-0 scale-95 origin-right pointer-events-none
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-200
        "
        >
          Gọi hotline: 0939 030 601
        </span>
      </motion.a>
    </div>
  );
}
