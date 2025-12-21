import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Container from "../components/Container";
import Section from "../components/Section";
import { motion } from "framer-motion";
import ServiceSolution from "../components/ServiceSolution";
import ContentProduction from "../components/ContentProduction";
import Process from "../components/Process";
import Accordions from "../components/Accordions";
import ContactComponent from "../components/ContactComponent";
const Solution = () => {
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
              Giải pháp
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl"
            >
              Giải pháp và quy trình làm việc chính của MTBP
            </motion.p>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 mt-5 lg:mt-0 items-center justify-center">
            <div className=" flex flex-col order-1">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 leading-[150%]">
                BẠN KHÔNG BIẾT VỀ MARKETING?
              </h1>
              <p className="text-base text-gray-600 leading-full">
                Chúng tôi không bán dịch vụ. Chúng tôi xây dựng chiến lược,
                triển khai và đồng hành để thương hiệu phát triển bền vững
              </p>
              <a className="cursor-pointer border-2 border-primary text-primary mx-auto mt-10 px-18 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300">
                Nhận tư vấn & báo giá
              </a>
            </div>

            <div className="aspect-square md:w-3/5 rounded-sm object-cover order-0 md:order-2">
              <DotLottieReact
                src="https://lottie.host/7cb906ec-d326-4e30-8fda-b27cdc9e2cb1/B9XWUctn1J.lottie"
                loop
                autoplay
              />
            </div>
          </div>
          <ServiceSolution />
          <ContentProduction />
          <Process hText={"h2"} />
          <Accordions />
          <ContactComponent />
        </Container>
      </Section>
    </>
  );
};

export default Solution;
