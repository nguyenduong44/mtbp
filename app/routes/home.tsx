import HeroServices from "../components/HeroServices";
import HeroIntroduction from "../components/HeroIntroduction";
import type { Route } from "./+types/home";
import Process from "../components/Process";
import Sponsors from "../components/Sponsors";
import FeaturedWorks from "../components/FeaturedWorks";
import ContactComponent from "../components/ContactComponent";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "MTBP Agency | Giải pháp Marketing, Thương hiệu & Sản xuất Nội dung sáng tạo",
    },
    {
      name: "description",
      content:
        "MTBP Agency cung cấp giải pháp marketing tổng thể: chiến lược thương hiệu, social media, sản xuất nội dung và triển khai sáng tạo. Tập trung vào hiệu quả dài hạn, không làm marketing đại trà.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <HeroIntroduction />
      <HeroServices />
      <Process />
      <Sponsors />
      <FeaturedWorks />
      <ContactComponent />
    </>
  );
}
