import { useParams, Link, useLoaderData } from "react-router";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import Section from "../components/Section";
import Container from "../components/Container";
import MediaGallery from "../components/MediaGallery";
import { useProjectBySlug } from "../hooks/useProjects";
import { projectService } from "../services/projectService";
import type { Route } from "./+types/works.$slug";
import { memo } from "react";
import MobileProjectContent from "../components/MobileProjectContent";

export async function loader({ params }: Route.LoaderArgs) {
  const work = await projectService.getBySlug(params.slug);
  if (!work) throw new Response("Not Found", { status: 404 });
  return { work };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.work) {
    return [{ title: "Dự án không tồn tại | MTBP Agency" }];
  }

  return [
    { title: `${data.work.title} | MTBP Agency Portfolio` },
    { name: "description", content: data.work.overview || "" },
  ];
}

// Memoize từng section để tránh re-render thừa
const ProjectSection = memo(({ section, sectionIndex }: any) => (
  <Section padding="md" background={sectionIndex % 2 !== 0 ? "white" : "gray"}>
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2 className="text-2xl font-conthrax md:text-3xl font-bold text-gray-900 mb-10 text-left">
          {section.title}
        </h2>
        <MediaGallery items={section.media_items} />
      </motion.div>
    </Container>
  </Section>
));

ProjectSection.displayName = "ProjectSection";

export default function WorkDetail() {
  const { work: initialWork } = useLoaderData<typeof loader>();
  const { slug } = useParams();

  // Vẫn sử dụng hook để hỗ trợ hydration và cache của React Query,
  // nhưng truyền initialData từ loader để render ngay lập tức.
  const { data: work, isLoading } = useProjectBySlug(slug!);

  // Dự phòng nếu hook chưa trả về (dù đã có initialData trong cache nếu được setup đúng,
  // nhưng ở đây ta ưu tiên dữ liệu từ loader để SEO)
  const displayWork = work || initialWork;

  if (!displayWork) {
    return (
      <Section padding="xl">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Không tìm thấy dự án
            </h1>
            <Link
              to="/du-an"
              className="text-primary hover:underline inline-flex items-center font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách dự án
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook size={20} />;
      case "instagram":
        return <Instagram size={20} />;
      case "youtube":
        return <Youtube size={20} />;
      case "tiktok":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="18" r="4" />
            <path d="M12 18V2l7 4" />
          </svg>
        );
      default:
        return <Globe size={20} />;
    }
  };

  return (
    <div style={{ transform: "translateZ(0)" }}>
      {/* Header Section */}
      <Section padding="sm" background="white">
        <Container>
          <Link
            to="/du-an"
            className="inline-flex items-center text-gray-900 hover:text-primary transition font-bold mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại portfolio
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-6 mb-8 text-left">
              {displayWork.clients?.logo && (
                <div className="w-20 h-20 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-white shadow-sm overflow-hidden">
                  <img
                    src={displayWork.clients.logo}
                    alt={displayWork.clients.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-conthrax text-gray-900 leading-tight">
                  {displayWork.title}
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest mt-2">
                  {displayWork.clients?.name}
                  {displayWork.clients?.industries?.name && (
                    <span className="ml-2 text-gray-300">
                      • {displayWork.clients.industries.name}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-2">
              {displayWork.categories?.map((cat: any, i: number) => (
                <div
                  key={i}
                  className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 tracking-wide"
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      <div className="md:hidden">
        <MobileProjectContent work={displayWork} />
      </div>

      {/* Overview Section */}
      <div className="hidden md:block">
        <Section padding="md" background="gray">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-left"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-conthrax">
                Tổng quan & vấn đề
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
                {displayWork.overview}
              </p>
            </motion.div>
          </Container>
        </Section>

        {/* Solution Section */}
        {displayWork.solution && (
          <Section padding="md" background="white">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-left"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-conthrax">
                  Giải pháp thực hiện
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
                  {displayWork.solution}
                </p>
              </motion.div>
            </Container>
          </Section>
        )}

        {/* Scope of Work */}
        {displayWork.scope && displayWork.scope.length > 0 && (
          <Section padding="md" background="gray">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-left"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-conthrax">
                  Phạm vi công việc
                </h2>
                <ul className="space-y-4">
                  {displayWork.scope.map((item: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start text-gray-700 font-medium"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 mt-0.5 font-bold text-xs">
                        {index + 1}
                      </span>
                      <span className="text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Container>
          </Section>
        )}

        {/* Results */}
        {displayWork.results && displayWork.results.length > 0 && (
          <Section padding="md" background="white">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-left"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-conthrax">
                  Kết quả đạt được
                </h2>
                <ul className="space-y-4">
                  {displayWork.results.map((result: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start text-gray-700 font-bold"
                    >
                      <CheckCircle className="flex-shrink-0 w-6 h-6 text-primary mr-4 mt-0.5" />
                      <span className="text-lg">{result}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Container>
          </Section>
        )}

        {/* Media Sections */}
        {displayWork.media_sections?.map(
          (section: any, sectionIndex: number) => (
            <ProjectSection
              key={section.id || sectionIndex}
              section={section}
              sectionIndex={sectionIndex}
            />
          ),
        )}
      </div>

      {/* Social Links */}
      {displayWork.social_links && displayWork.social_links.length > 0 && (
        <Section padding="md" background="gray">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-conthrax">
                Các nền tảng của khách hàng
              </h2>
              <p className="text-gray-500 mb-10 font-medium">
                Truy cập trực tiếp các nền tảng của khách hàng để kiểm chứng.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {displayWork.social_links.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-gray-100 text-gray-700 hover:text-white hover:bg-gray-900 hover:border-gray-900 transition-all shadow-xl shadow-gray-200 group"
                  >
                    <span className="group-hover:text-white transition-colors">
                      {getSocialIcon(link.platform)}
                    </span>
                    <span className="font-black uppercase text-xs tracking-wider">
                      {link.label || link.platform}
                    </span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* CTA Section */}
      <Section padding="lg" background="white">
        <Container size="md">
          <div className="text-center bg-secondary rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-gray-300">
            <h2 className=" font-conthrax text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-6">
              Bạn muốn kết quả tương tự?
            </h2>
            <p className="text-lg text-gray-400 mb-10 font-medium">
              Liên hệ với chúng tôi để bắt đầu dự án của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/lien-he">
                <button className="cursor-pointer px-10 py-5 bg-primary text-white rounded-full font-bold text-lg border border-2 hover:border-primary hover:bg-white hover:text-primary transition-all duration-300">
                  Bắt đầu dự án
                </button>
              </Link>
              <Link to="/du-an">
                <button className="cursor-pointer px-10 py-5 bg-white/10 text-primary border border-2 border-primary rounded-full font-bold text-lg hover:bg-primary hover:text-secondary transition-all">
                  Xem thêm case khác
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
