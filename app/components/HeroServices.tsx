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

const HeroServices = () => {
  return (
    <Section background="gray" padding="lg">
      <Container>
        <h1 className="font-bold text-[45px] mb-4">Dịch vụ</h1>
        <ItemGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroServices.map((model) => (
            <Item key={model.id} variant="outline">
              <ItemHeader>
                <div className="aspect-square w-full rounded-sm object-cover">
                  <DotLottieReact src={model.icon} autoplay loop />
                </div>
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="text-[24px]">{model.title}</ItemTitle>
                <ItemDescription className="line-clamp-none md:line-clamp-2">
                  {model.description}
                </ItemDescription>
              </ItemContent>
              <ItemFooter className="flex flex-col items-start">
                {model.bullets.map((list) => (
                  <Badge className="whitespace-nowrap">{list}</Badge>
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
          <a className="text-gray-500 hover:text-primary transition-transform hover:-translate-y-1 duration-300 linear text-lg font-medium inline-flex items-center gap-2 transition-colors cursor-pointer">
            Xem các Case Studies <ArrowDown size={18} />
          </a>
        </motion.div>
      </Container>
    </Section>
  );
};

export default HeroServices;
