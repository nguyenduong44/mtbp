import { processes } from "../data/processes";
import Container from "./Container";
import Section from "./Section";
import { motion } from "framer-motion";
type ProcessProps = {
  hText?: string;
};
const Process = ({ hText }: ProcessProps) => {
  return (
    <Section background="gray">
      <Container>
        {hText ? (
          <>
            <h2 className="font-conthrax text-3xl font-semibold text-gray-900">
              Cách tiếp cận
            </h2>
            <p className="mt-4 text-gray-600">
              Quy trình 5 bước minh bạch và hiệu quả
            </p>
          </>
        ) : (
          <h1 className="font-bold text-[45px] mb-4 font-conthrax">
            Quy trình làm việc
          </h1>
        )}

        {/* Mobile: carousel, chỉ hiện title */}
        <div className="mt-10 overflow-hidden md:hidden">
          <motion.ul
            drag="x"
            dragConstraints={{ left: -900, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            className="flex gap-4 cursor-grab active:cursor-grabbing"
          >
            {processes.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="min-w-[48%] shrink-0 p-5 text-center border-2 border-black/10 rounded-xl bg-white"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white text-base font-semibold">
                    {item.id}
                  </div>

                  <h4 className="mt-4 text-base leading-6 font-semibold text-gray-900">
                    {item.step}
                  </h4>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Tablet + desktop: giữ nguyên code và giao diện cũ */}
        <div className="mt-20 hidden md:block">
          <ul className="space-y-20">
            {processes.map((item) => (
              <motion.li
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                key={item.id}
                className="p-5 pb-10 text-center border border-2 border-black/10 rounded-xl"
              >
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 relative top-0 -mt-16">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-white border-4 border-white text-xl font-semibold">
                      {item.id}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg leading-6 font-semibold text-gray-900">
                      {item.step}
                    </h4>

                    <p className="mt-2 text-base leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
};

export default Process;
