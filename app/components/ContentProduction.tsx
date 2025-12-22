import Section from "./Section";
import Container from "./Container";
import { BadgeCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Lên ý tưởng sáng tạo & kịch bản chi tiết",
    description:
      "Phân tích thương hiệu, mục tiêu và nền tảng để xây dựng concept, thông điệp và kịch bản phù hợp.",
  },
  {
    step: "02",
    title: "Quay video & Chụp hình",
    description:
      "Triển khai sản xuất nội dung với đội ngũ quay dựng, đảm bảo hình ảnh và cảm xúc đúng định hướng.",
  },
  {
    step: "03",
    title: "Edit & Thiết kế sản phẩm",
    description:
      "Dựng video, chỉnh màu, thiết kế hình ảnh và hoàn thiện nội dung theo tiêu chuẩn thương hiệu.",
  },
  {
    step: "04",
    title: "Tối ưu định dạng từng nền tảng",
    description:
      "Điều chỉnh tỷ lệ, độ dài và format phù hợp cho Facebook, Instagram, TikTok và các nền tảng khác.",
  },
];

export default function ContentProduction() {
  return (
    <Section background="gray" padding="lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Process */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Quy trình sản xuất nội dung
            </h2>
            <p className="mt-4 max-w-xl text-gray-600">
              Chúng tôi xây dựng nội dung từ ý tưởng đến sản phẩm cuối cùng, đảm
              bảo tính sáng tạo, nhất quán và hiệu quả trên từng nền tảng.
            </p>

            <div className="mt-8 space-y-6">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-primary text-sm font-semibold">
                    <BadgeCheck />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Team Images */}

          <div className="flex items-center gap-2 w-full">
            <div className="relative group flex-grow transition-all w-1/5 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
              <img
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop"
                alt="image"
              />
            </div>
            <div className="relative group flex-grow transition-all w-1/5 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
              <img
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop"
                alt="image"
              />
            </div>
            <div className="relative group flex-grow transition-all w-1/5 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
              <img
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop"
                alt="image"
              />
            </div>
            <div className="relative group flex-grow transition-all w-1/5 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
              <img
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop"
                alt="image"
              />
            </div>
            <div className="relative group flex-grow transition-all w-1/5 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
              <img
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop"
                alt="image"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
