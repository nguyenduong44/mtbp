import Container from "./Container";
import Section from "./Section";
import { motion } from "framer-motion";
import { sponsorsImage } from "../data/sponsorsImage";

const Sponsors = () => {
  return (
    <Section padding="sm" background="gray">
      <Container>
        <h1 className="text-center font-medium text-gray-500 text-[18px] md:text-[24px] mb-10">
          Được tin tưởng bởi các thương hiệu địa phương
        </h1>
        <motion.div className="flex flex-wrap gap-8 justify-center md:justify-between">
          {sponsorsImage.map((brand) => (
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-8 md:w-10 object-contain "
            />
          ))}
        </motion.div>
      </Container>
    </Section>
  );
};

export default Sponsors;
