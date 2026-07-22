import { Link } from "react-router";
import { useProjects } from "../hooks/useProjects";
import Container from "./Container";
import Section from "./Section";
import WorkCard from "./WorkCards";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedWorksProps {
  initialData?: any[];
}

const FeaturedWorks = ({ initialData }: FeaturedWorksProps) => {
  const { data, isLoading: queryLoading } = useProjects(
    {
      featured: true,
      limit: 3,
    },
    { enabled: !initialData },
  );

  const featuredWorks = initialData || data?.data || [];
  const isLoading = !initialData && queryLoading;

  if (isLoading && featuredWorks.length === 0) {
    return (
      <Section padding="lg" background="gray">
        <Container className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={40} />
        </Container>
      </Section>
    );
  }

  return (
    <Section background="gray">
      <Container>
        <h1 className="font-bold font-conthrax text-[45px] mb-4 text-left">
          Các dự án tiêu biểu
        </h1>
        <div className="overflow-hidden sm:overflow-visible">
          <motion.div
            drag="x"
            dragConstraints={{ left: -600, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            className="
              flex gap-6 mb-8
              sm:grid sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {featuredWorks.map((work, index) => (
              <div key={work.id} className="min-w-[85%] sm:min-w-0">
                <WorkCard work={work} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="text-center">
          <Link to="/du-an" className="relative inline-block group">
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
