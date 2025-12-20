import { useParams, Link } from "react-router";
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
import { getWorkBySlug } from "../data/portfolio";
import type { Route } from "./+types/works.$slug";
import type { SocialLink } from "../types";

export function meta({ params }: Route.MetaArgs) {
  const work = getWorkBySlug(params.slug);

  if (!work) {
    return [{ title: "Work Not Found - MTBP Agency" }];
  }

  return [
    { title: `${work.client.name} - MTBP Agency Portfolio` },
    { name: "description", content: work.overview },
  ];
}

export default function WorkDetail() {
  const params = useParams();

  const { slug } = params;

  if (!slug) {
    return <div>NOTFOUND</div>;
  }

  const work = getWorkBySlug(slug);
  if (!work) {
    return (
      <Section padding="xl">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Không tìm thấy dự án
            </h1>
            <Link
              to="/works"
              className="text-primary hover:underline inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách dự án
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const categoryLabels: Record<string, string> = {
    smm: "Truyền thông mạng xã hội",
    branding: "Thiết kế nhận diện thương hiệu",
    kol: "Xây dựng thương hiệu cá nhân KOL",
    production: "Sản xuất nội dung",
  };

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
            className="lucide lucide-music-2"
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
    <>
      {/* Back Button */}
      <Section padding="sm" background="white">
        <Container>
          <Link
            to="/works"
            className="inline-flex items-center text-gray-900 hover:text-primary transition font-medium mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại portfolio
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              {work.client.logo && (
                <img
                  src={work.client.logo}
                  alt={work.client.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {work.client.name}
                </h1>
                <p className="text-gray-600">{work.client.industry}</p>
              </div>
            </div>

            {/* Category Badge */}
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              {work.category.toUpperCase()}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Overview Section */}
      <Section padding="md" background="gray">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Tổng quan & vấn đề
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {work.overview}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Scope of Work */}
      <Section padding="md" background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Phạm vi công việc
            </h2>
            <ul className="space-y-3">
              {work.scope.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start text-gray-700"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5 font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </Container>
      </Section>

      {/* Results */}
      <Section padding="md" background="gray">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Kết quả đạt được
            </h2>
            <ul className="space-y-4">
              {work.results.map((result, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start text-gray-700"
                >
                  <CheckCircle className="flex-shrink-0 w-6 h-6 text-primary mr-3 mt-0.5" />
                  <span className="text-lg">{result}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </Container>
      </Section>

      {/* Services Used */}
      <Section padding="md" background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <h2 className="text-2xl w-full md:text-3xl font-bold text-gray-900 mb-6">
              Dịch vụ sử dụng
            </h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {work.servicesUsed.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-semibold"
                >
                  {categoryLabels[service] || service}
                </motion.div>
              ))}
            </div>

            <Link
              to="/contact"
              className="bg-primary block text-center py-4 hover:bg-blue-600 text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Yêu cầu tư vấn dịch vụ tương tự
            </Link>
          </motion.div>
        </Container>
      </Section>

      {/* Media Sections */}
      {work.mediaSections.map((section, sectionIndex) => (
        <Section
          key={sectionIndex}
          padding="md"
          background={sectionIndex % 2 === 0 ? "white" : "gray"}
        >
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                {section.title}
              </h2>
              <MediaGallery items={section.items} />
            </motion.div>
          </Container>
        </Section>
      ))}

      {/* Social Links */}
      {work.socialLinks.length > 0 && (
        <Section padding="md" background="gray">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Các nền tảng của khách hàng
              </h2>
              <p className="text-gray-500 mb-8">
                Truy cập trực tiếp các nền tảng của khách hàng để kiểm chứng.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {work.socialLinks.map((link: SocialLink, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-white hover:bg-primary hover:border-primary transition-all shadow-sm group"
                  >
                    <span className="group-hover:text-white transition-colors">
                      {getSocialIcon(link.platform)}
                    </span>
                    <span className="font-bold capitalize">
                      {link.labels || link.platform}
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
          <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bạn muốn kết quả tương tự?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Liên hệ với chúng tôi để bắt đầu dự án của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-colors">
                  Bắt đầu dự án
                </button>
              </Link>
              <Link to="/works">
                <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-colors">
                  Xem thêm case khác
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
