import HeroServices from "../components/HeroServices";
import HeroIntroduction from "../components/HeroIntroduction";
import type { Route } from "./+types/home";
import Process from "../components/Process";
import Sponsors from "../components/Sponsors";
import FeaturedWorks from "../components/FeaturedWorks";
import ContactComponent from "../components/ContactComponent";
import { useLoaderData } from "react-router";
import { categoryService } from "../services/categoryService";
import { clientService } from "../services/clientService";
import { projectService } from "../services/projectService";

export async function loader() {
  const [categories, clients, featuredProjects] = await Promise.all([
    categoryService.getAll({ limit: 100 }),
    clientService.getAll({ limit: 6, sortBy: "name", sortOrder: "desc" }),
    projectService.getAll({ featured: true, limit: 3 })
  ]);

  return {
    categories: categories.data,
    clients: clients.data,
    featuredProjects: featuredProjects.data
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "MTBP Agency | Giải pháp Marketing, Thương hiệu & Sản xuất Nội dung sáng tạo",
    },
    {
      name: "description",
      content:
        "MTBP Agency cung cấp giải pháp marketing tổng thể: chiến lược thương hiệu, social media, sản xuất nội dung và triển khai sáng tạo. Tập trung vào hiệu quả dài hạn, không làm marketing đại trà.",
    },
  ];
}

export default function Home() {
  const { categories, clients, featuredProjects } = useLoaderData<typeof loader>();

  return (
    <>
      <HeroIntroduction initialCategories={categories} />
      <HeroServices initialData={categories} />
      <Process />
      <Sponsors initialData={clients} />
      <FeaturedWorks initialData={featuredProjects} />
      <ContactComponent />
    </>
  );
}
