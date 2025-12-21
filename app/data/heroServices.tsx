import { Activity, Paintbrush, PersonStanding } from "lucide-react";
import type { ServiceFeature } from "../types.js";

export const heroServices: ServiceFeature[] = [
  {
    id: "social-media",
    title: "Truyền thông mạng xã hội",
    description:
      "Xây chiến lược và tạo nội dung giúp thương hiệu xuất hiện nhất quán và hiệu quả trên các nền tảng.",
    bullets: [
      "Chiến lược nội dung",
      "Thiết kế & video ngắn",
      "Quản lý fanpage",
      "Chiến dịch truyền thông",
      "Tối ưu hiệu suất",
    ],
    icon: "https://lottie.host/ad0c7e1c-5c24-484c-a241-8b8a787d4ebe/0oJNLLzUsk.lottie",
    lucideIcon: <Activity />,
  },
  {
    id: "brand-identity",
    title: "Thiết kế nhận diện thương hiệu",
    description:
      "Xây dựng bộ nhận diện hoàn chỉnh giúp thương hiệu nổi bật và đáng nhớ.",
    bullets: [
      "Thiết kế logo",
      "Brand guidelines",
      "Stationery",
      "Packaging",
      "Bảng hiệu & ấn phẩm",
    ],
    icon: "https://lottie.host/b1e97d42-72fd-4313-b647-d85a32f88bb3/cXHUJ4sV5X.lottie",
    lucideIcon: <Paintbrush />,
  },
  {
    id: "personal-brand",
    title: "Xây dựng thương hiệu cá nhân",
    description:
      "Định vị và phát triển thương hiệu cá nhân thông qua hình ảnh, nội dung và chiến lược dài hạn.",
    bullets: [
      "Định vị cá nhân",
      "Chiến lược nội dung",
      "Thiết kế hình ảnh",
      "Tối ưu social profile",
      "Media production",
    ],
    icon: "https://lottie.host/bcbcbfd0-f800-442e-849e-8d53a9991f5b/qGjxILcN3P.lottie",
    lucideIcon: <PersonStanding />,
  },
];
