import { Link } from "react-router";
import { getWorkByFeatured } from "../data/portfolio";
import Container from "./Container";
import Section from "./Section";
import WorkCard from "./WorkCards";
import { ArrowRight } from "lucide-react";

const FeaturedWorks = () => {
  const featuredWorks = getWorkByFeatured().slice(0, 4);
  return (
    <Section padding="lg" background="gray">
      <Container>
        <h1 className="font-bold text-[45px] mb-4">Các dự án tiêu biểu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredWorks.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/works" className="relative inline-block group">
            <button className="inline-flex items-center text-gray-800 font-bold text-lg cursor-pointer">
              Xem tất cả dự án
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-gray-800 group-hover:w-3/6 duration-300 ease-out"></span>
              <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-gray-800 group-hover:w-3/6 duration-300 ease-out"></span>
            </button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default FeaturedWorks;
