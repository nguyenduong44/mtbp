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
import { ArrowDown, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../types";

interface HeroServicesProps {
  initialData?: Category[];
}

const HeroServices = ({ initialData }: HeroServicesProps) => {
  const { data: queryData, isLoading: queryLoading } = useCategories(
    { limit: 100 },
    { enabled: !initialData },
  );

  const categories = initialData || queryData?.data || [];

  return (
    <Section background="gray">
      <Container>
        <h1 className="font-bold font-conthrax text-[45px] mb-4">Dịch vụ</h1>
        <ItemGroup className="grid grid-cols-2 sm:grid-cols-3 items-center gap-4">
          {categories.map((cat) => (
            <Item key={cat.id} variant="outline">
              <ItemHeader>
                <div className="aspect-square w-full rounded-sm object-cover">
                  {cat.icon_url && <img src={cat.icon_url} />}
                </div>
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="sm:text-[24px] font-conthrax">
                  {cat.name}
                </ItemTitle>
                <ItemDescription className="line-clamp-none md:line-clamp-2">
                  {cat.description}
                </ItemDescription>
              </ItemContent>
              <ItemFooter className="hidden sm:flex flex-col items-start">
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
