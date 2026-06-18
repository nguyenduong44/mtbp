import { useEffect, useRef, useState } from "react";
import { Users, PlayCircle, Briefcase, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../types";

// --- COMPONENT ĐẾM SỐ TỰ ĐỘNG ---
const CountUp = ({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));

    let controls;

    if (isInView) {
      controls = animate(count, value, {
        duration,
        ease: "easeOut",
      });
    }

    return () => {
      unsubscribe();
      controls?.stop();
    };
  }, [isInView, value, duration, count, rounded]);

  return <span ref={ref}>{displayValue}</span>;
};

interface HeroIntroductionProps {
  initialCategories?: Category[];
}

const HeroIntroduction = ({ initialCategories }: HeroIntroductionProps) => {
  const { data: categoriesData } = useCategories({
    limit: 100,
  });

  const categories = initialCategories || categoriesData?.data || [];

  const stats = [
    {
      value: 30,
      suffix: "+",
      label: "Khách hàng đồng hành",
      icon: <Users className="text-purple-600" size={20} />,
      bg: "bg-purple-50",
    },
    {
      value: 300,
      suffix: "+",
      label: "Videos social đã sản xuất",
      icon: <PlayCircle className="text-blue-600" size={20} />,
      bg: "bg-blue-50",
    },
    {
      value: 100,
      suffix: "+",
      label: "Hạng mục Online & Offline",
      icon: <Briefcase className="text-amber-600" size={20} />,
      bg: "bg-amber-50",
    },
  ];

  const getIcon = (name: string | null) => {
    if (!name) return <CheckCircle2 size={14} />;
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={14} /> : <CheckCircle2 size={14} />;
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-white pb-10 sm:pb-20">
      {/* Background trái - Mờ dần khi vào giữa */}
      <div className="absolute left-0 top-0 h-full w-[50%] z-0">
        <img
          src="/hero-left.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white" />
      </div>

      {/* Background phải - Mờ dần khi vào giữa */}
      <div className="absolute right-0 top-0 h-full w-[50%] z-0">
        <img
          src="/hero-right.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-white" />
      </div>

      {/* Overlay phủ toàn bộ để làm dịu hình ảnh */}
      <div className="absolute inset-0 z-1 bg-white/5 backdrop-blur-[0.5px]" />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <main className="flex flex-col items-center justify-center text-center px-4 max-w-7xl w-full pt-4 pb-8 sm:pt-12 sm:pb-12">
          <div className="mb-4 sm:mb-8 rounded-full border bg-white/70 px-6 py-3 backdrop-blur-sm">
            <img src="/logo_3.png" alt="MTBP" className="h-16 sm:h-24 w-auto" />
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-8">
            <span className="block">Hãy để MTBP tối ưu</span>
            <span className="relative text-primary inline-block">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-primary/30"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative z-10 leading-[150%]">
                chiến dịch Marketing
              </span>
            </span>
            <span className="block mt-1 sm:mt-2">của bạn</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed font-medium mb-6 sm:mb-12">
            Hãy nói lên điều bạn nghĩ. Chúng tôi tin rằng công việc và các mối
            quan hệ sẽ trở nên tốt đẹp hơn khi chúng ta có thể chia sẻ cảm xúc,
            suy nghĩ của mình một cách cởi mở và mang tính xây dựng.
          </p>

          <a
            className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 sm:px-12 sm:py-5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 text-base sm:text-lg mb-10 sm:mb-30"
            href="/lien-he"
          >
            Liên hệ ngay
          </a>

          {/* Service Chips - Dữ liệu thực tế từ Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl px-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-100 shadow-sm text-gray-600 hover:border-primary hover:text-primary transition-all cursor-default group"
              >
                <span className="text-gray-400 group-hover:text-primary">
                  {getIcon(cat.lucide_icon_name)}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Stats Section - Số liệu yêu cầu & Animation chạy số */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 text-left group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 leading-none mb-1">
                    <CountUp value={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">
                    {stat.label}
                  </div>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block h-12 w-[1px] bg-gray-100 ml-auto" />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default HeroIntroduction;
