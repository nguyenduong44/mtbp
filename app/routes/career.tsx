import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Container from "../components/Container";
import Section from "../components/Section";
import type { Route } from "./+types/career";
import { motion } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Tuyển dụng MTBP Agency | Cơ hội nghề nghiệp trong Marketing & Sáng tạo",
    },
    {
      name: "description",
      content:
        "Khám phá cơ hội nghề nghiệp tại MTBP Agency. Môi trường sáng tạo, tôn trọng cá tính, tập trung vào chất lượng công việc và sự phát triển dài hạn của mỗi cá nhân.",
    },
  ];
}
const Career = () => {
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
              Tuyển dụng
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl"
            >
              Chúng tôi tìm những người muốn xây dựng sự nghiệp bằng chất lượng
              công việc.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section padding="sm" background="white">
        <Container className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="aspect-square flex-1 object-cover p-4">
            <DotLottieReact
              src="https://lottie.host/183f1ee5-469a-4834-ade9-ab3a7960118a/pVUZsjQHLQ.lottie"
              loop
              autoplay
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-4xl font-semibold text-gray-900">
              MTBP là ai?
            </h2>

            <p className="mt-4 text-lg text-gray-600 max-w-3xl leading-relaxed">
              MTBP là một agency marketing tập trung vào chiến lược, nội dung và
              hình ảnh. Chúng tôi tin rằng marketing hiệu quả không đến từ sự ồn
              ào, mà từ tư duy đúng, quy trình rõ ràng và sự nghiêm túc với từng
              sản phẩm được tạo ra.
            </p>

            <p className="mt-4 text-lg text-gray-600 max-w-3xl leading-relaxed">
              Ở đây, bạn được tự do suy nghĩ, được bảo vệ quan điểm nếu có lý do
              hợp lý, và được kỳ vọng phải trưởng thành cùng từng dự án mình
              tham gia.
            </p>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl leading-relaxed">
              Không có ý tưởng nào là điên rồ. Mọi sáng kiến đều được lắng nghe
              và thử nghiệm.
            </p>
            <div className="mt-4">
              <div className="border-t-3 border-primary p-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Chủ động liên hệ với chúng tôi để ứng tuyển.
                </h3>
                <a
                  href="mailto:hr@mtbp.vn"
                  className="inline-block mt-6 text-primary font-semibold text-3xl underline"
                >
                  hr@mtbp.vn
                </a>

                <p className="mt-2 text-base text-gray-500">
                  CV / Portfolio / Một vài dòng giới thiệu về bạn
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default Career;
