import { processes } from "../data/processes";
import Container from "./Container";
import Section from "./Section";
import { motion } from "framer-motion";

const Process = () => {
  return (
    <Section padding="lg" background="gray">
      <Container>
        <h1 className="font-bold text-[45px] mb-4">Quy trình làm việc</h1>
        <div className="mt-20">
          <ul className="">
            {processes.map((item) => (
              <motion.li
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                key={item.id}
                className=" p-5 pb-10 text-center mb-20 border border-2 border-black/10 rounded-xl"
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
