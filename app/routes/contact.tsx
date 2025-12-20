import ContactComponent from "../components/ContactComponent";
import type { Route } from "./+types/contact";

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
    <div>
      <ContactComponent />
    </div>
  );
}
