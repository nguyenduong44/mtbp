import { useEffect, useRef, useState } from "react";
import { getWorkByCategory, portfolioWorks } from "../data/portfolio";
import type { WorkCategory } from "../types";
import WorkCard from "./WorkCards";

interface PortfolioInfiniteProps {
  category?: WorkCategory;
}
const PAGE_SIZE = 6;

const PortfolioInfinite = ({ category = "all" }: PortfolioInfiniteProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredWorks = getWorkByCategory(category);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filteredWorks.length) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filteredWorks.length),
          );
        }
      },
      {
        rootMargin: "200px",
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredWorks.length]);

  const visibleWorks = filteredWorks.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
        {visibleWorks.map((work, index) => (
          <WorkCard key={`${work.id}-${index}`} work={work} index={index} />
        ))}
      </div>

      {/* Sentinel */}
      {visibleCount < portfolioWorks.length && (
        <div ref={loadMoreRef} className="h-10" />
      )}
    </>
  );
};

export default PortfolioInfinite;
