import { useEffect, useRef, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import WorkCard from "./WorkCards";
import { Loader2 } from "lucide-react";

interface PortfolioInfiniteProps {
  industrySlug?: string;
  initialData?: any[];
}
const PAGE_SIZE = 6;

const PortfolioInfinite = ({
  industrySlug = "all",
  initialData,
}: PortfolioInfiniteProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch all projects for this industry
  const { data, isLoading: queryLoading } = useProjects(
    {
      industrySlug: industrySlug === "all" ? null : industrySlug,
      limit: 100,
    },
    {
      enabled: !initialData || industrySlug !== "all", // Refetch if industry changes
    },
  );

  // Use initialData only for the "all" category on first load
  const filteredWorks =
    industrySlug === "all" && initialData ? initialData : data?.data || [];
  const isLoading = !filteredWorks.length && queryLoading;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [industrySlug]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  const visibleWorks = filteredWorks.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 text-left">
        {visibleWorks.map((work, index) => (
          <WorkCard key={`${work.id}-${index}`} work={work} index={index} />
        ))}
      </div>

      {visibleWorks.length === 0 && !isLoading && (
        <div className="py-20 text-center">
          <p className="text-gray-500">Chưa có dự án nào trong danh mục này.</p>
        </div>
      )}

      {/* Sentinel */}
      {visibleCount < filteredWorks.length && (
        <div ref={loadMoreRef} className="h-10" />
      )}
    </>
  );
};

export default PortfolioInfinite;
