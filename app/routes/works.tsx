import { AnimatePresence, motion } from "framer-motion";
import Container from "../components/Container";
import PortfolioInfinite from "../components/PortfolioInfinite";
import Section from "../components/Section";
import type { Route } from "./+types/works";
import type { WorkCategory } from "../types";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio - MTBP Agency" },
    { name: "description", content: "Case studies và dự án thực tế của MTBP" },
  ];
}

const categories = [
  { value: "all" as WorkCategory, label: "Tất cả" },
  { value: "smm" as WorkCategory, label: "Truyền thông mạng xã hội" },
  {
    value: "branding" as WorkCategory,
    label: "Thiết kế nhận diện thương hiệu",
  },
  { value: "kol" as WorkCategory, label: "Xây dựng thương hiệu cá nhân KOL" },
  {
    value: "production" as WorkCategory,
    label: "Sản xuất nội dung",
  },
];

export default function Works() {
  const [activeCategory, setActiveCategory] = useState<WorkCategory>("all");
  return (
    <>
      <Section background="gray" padding="sm">
        <Container>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-[45px] mb-4"
            >
              Dự án
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl"
            >
              Case studies và dự án thực tế của chúng tôi
            </motion.p>
          </div>
        </Container>
      </Section>
      <Section background="gray" padding="sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap gap-8"
          >
            {categories.map((cat, index) => (
              <button
                key={index}
                className="group relative overflow-hidden font-semibold text-gray-900 transition-colors duration-300 cursor-pointer border-1 border-gray-400 hover:border-primary px-4 py-2 rounded-full"
                onClick={() => setActiveCategory(cat.value)}
              >
                <span className="relative z-10 text-base sm:text-lg font-medium group-hover:text-primary transition-colors ease-out duration-400">
                  {cat.label}
                </span>
              </button>
            ))}
          </motion.div>

          <PortfolioInfinite category={activeCategory} />
        </Container>
      </Section>

      <Section padding="md" background="gray">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bạn đã sẵn sàng cho dự án tiếp theo?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Hãy để MTBP giúp bạn đạt được mục tiêu cho thương hiệu của mình
            </p>
            <button className="cursor-pointer border-2 border-primary text-primary px-24 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300">
              Liên hệ
            </button>
          </div>
        </Container>
      </Section>
    </>
  );
}
