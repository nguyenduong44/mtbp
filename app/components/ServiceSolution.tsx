import { useEffect, useState } from "react";
import Container from "./Container";
import Section from "./Section";
import { supabase } from "../supabase-client";
import type { Category } from "../types";
import * as LucideIcons from "lucide-react";

export default function ServiceSolution() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  return (
    <Section background="white" padding="lg">
      <Container>
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold text-gray-900 text-left">
            Dịch vụ chúng tôi cung cấp
          </h2>
          <p className="mt-4 text-gray-600 text-left">
            Tập trung vào chiến lược, nội dung và hình ảnh giúp thương hiệu phát
            triển bền vững.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat) => {
            // Lấy component icon động từ thư viện lucide-react
            const IconComponent = (LucideIcons as any)[cat.lucide_icon_name || ""] || LucideIcons.Activity;
            
            return (
              <div
                key={cat.id}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] rounded-xl border border-gray-200 p-6 transition hover:border-primary text-left bg-white"
              >
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconComponent className="text-primary" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{cat.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {cat.bullets?.slice(0, 5).map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
