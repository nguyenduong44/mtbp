import Container from "./Container";
import Section from "./Section";
import { motion } from "framer-motion";
import { sponsorsImage } from "../data/sponsorsImage";

const Sponsors = () => {
  return (
    <Section padding="sm" background="gray">
      <Container className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-slate-600 text-center">
          Được tin tưởng bởi các thương hiệu địa phương
        </h3>
        <div className="max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mt-14">
          <div className="bg-gray-100 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/clickup.svg"
              alt="Logo"
            />
          </div>
          <div className="bg-gray-100 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/airtable.svg"
              alt="Logo"
            />
          </div>
          <div className="bg-gray-100 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/miro.svg"
              alt="Logo"
            />
          </div>
          <div className="bg-gray-100 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/slack.svg"
              alt="Logo"
            />
          </div>
          <div className="bg-gray-100 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/huawei.svg"
              alt="Logo"
            />
          </div>
          <div className="bg-gray-100 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/asana.svg"
              alt="Logo"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Sponsors;
