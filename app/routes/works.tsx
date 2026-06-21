import { motion } from "framer-motion";
import Container from "../components/Container";
import PortfolioInfinite from "../components/PortfolioInfinite";
import Section from "../components/Section";
import type { Route } from "./+types/works";
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { industryService } from "../services/industryService";
import { projectService } from "../services/projectService";

export async function loader() {
  const [industries, initialProjects] = await Promise.all([
    industryService.getAll({ limit: 100 }),
    projectService.getAll({ limit: 100 }), // Load all for initial view
  ]);

  return {
    industries: industries.data,
    initialProjects: initialProjects.data,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio - MTBP Agency" },
    {
      name: "description",
      content: "Case studies và dự án thực tế của MTBP theo từng ngành nghề",
    },
  ];
}

export default function Works() {
  const { industries: industriesData, initialProjects } =
    useLoaderData<typeof loader>();
  const [activeIndustry, setActiveIndustry] = useState<string>("all");

  const industries = [
    { slug: "all", name: "Tất cả" },
    ...(industriesData || []),
  ];

  return (
    <>
      <Section background="gray" padding="sm">
        <Container>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-[45px] mb-4 text-left font-conthrax"
            >
              Dự án
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl text-left"
            >
              Case studies và dự án thực tế của chúng tôi phân loại theo lĩnh
              vực
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
            className="mb-6 flex flex-wrap gap-4"
          >
            {industries.map((ind, index) => (
              <button
                key={index}
                className={`group relative overflow-hidden font-semibold transition-all duration-300 cursor-pointer border px-6 py-2 rounded-full text-sm
                  ${
                    activeIndustry === ind.slug
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                  }`}
                onClick={() => setActiveIndustry(ind.slug)}
              >
                <span className="relative z-10 font-bold uppercase tracking-wider">
                  {ind.name}
                </span>
              </button>
            ))}
          </motion.div>

          <PortfolioInfinite
            industrySlug={activeIndustry}
            initialData={initialProjects}
          />
        </Container>
      </Section>

      <Section padding="md" background="gray">
        <Container>
          <div className="text-center">
            <h2 className="font-conthrax text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bạn đã sẵn sàng cho dự án tiếp theo?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Hãy để MTBP giúp bạn đạt được mục tiêu cho thương hiệu của mình
            </p>
            <Link
              to="/lien-he"
              className="inline-block border-2 border-primary text-primary px-24 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              Liên hệ
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
