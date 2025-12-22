import ContactComponent from "../components/ContactComponent";
import Container from "../components/Container";
import Map from "../components/Map";
import Section from "../components/Section";
import type { Route } from "./+types/contact";
import { motion } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Liên hệ MTBP Agency | Tư vấn Marketing & Báo giá dự án" },
    {
      name: "description",
      content:
        "Liên hệ MTBP Agency để được tư vấn chiến lược marketing, xây dựng thương hiệu, social media và sản xuất nội dung. Phản hồi nhanh – tư vấn miễn phí.",
    },
  ];
}

export default function Contact() {
  return (
    <>
      <Section padding="sm" background="gray">
        <Container>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-[45px] mb-4"
            >
              Liên hệ
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl"
            >
              Hãy dành ít phút cung cấp giúp MTBP một vài thông tin cơ bản về
              nhu cầu của bạn.
            </motion.p>
          </div>
        </Container>
      </Section>
      <ContactComponent />
      <Map />
    </>
  );
}
