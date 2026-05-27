import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "components/ui/item";
import { Badge } from "components/ui/badge";
import { motion } from "framer-motion";
import Section from "./Section";
import Container from "./Container";
import { heroServices } from "../data/heroServices";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { Category } from "../types";

const HeroServices = () => {
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
    <Section background="gray" padding="lg">
      <Container>
        <h1 className="font-bold text-[45px] mb-4">Dịch vụ</h1>
        <ItemGroup className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          {categories.map((cat) => (
            <Item key={cat.id} variant="outline">
              <ItemHeader>
                <div className="aspect-square w-full rounded-sm object-cover">
                  {cat.icon_url && (
                    <DotLottieReact src={cat.icon_url} autoplay loop />
                  )}
                </div>
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="text-[24px]">{cat.name}</ItemTitle>
                <ItemDescription className="line-clamp-none md:line-clamp-2">
                  {cat.description}
                </ItemDescription>
              </ItemContent>
              <ItemFooter className="flex flex-col items-start">
                {cat.bullets?.map((bullet, idx) => (
                  <Badge key={idx} className="whitespace-nowrap">
                    {bullet}
                  </Badge>
                ))}
              </ItemFooter>
            </Item>
          ))}
        </ItemGroup>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Link
            to={"/du-an"}
            className="cursor-pointer text-gray-500 hover:text-primary transition-transform hover:-translate-y-1 duration-300 linear text-lg font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            Xem các Case Studies <ArrowDown size={18} />
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
};

export default HeroServices;
