import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import type { WorkPortfolio } from "../types";

interface WorkCardProps {
  work: WorkPortfolio;
  index?: number;
}

const WorkCard = ({ work, index = 0 }: WorkCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
      className="group relative cursor-pointer"
    >
      <Link to={`/du-an/${work.slug}`} className="block h-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 mb-4">
          <img
            src={work.thumbnail}
            alt={work.client.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"></div>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
              {work.client.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {work.servicesUsed.map((service, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium text-gray-800 border border-gray-700 uppercase tracking-wide"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default WorkCard;
