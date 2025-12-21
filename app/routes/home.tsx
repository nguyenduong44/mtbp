import HeroServices from "../components/HeroServices";
import HeroIntroduction from "../components/HeroIntroduction";
import type { Route } from "./+types/home";
import Process from "../components/Process";
import Sponsors from "../components/Sponsors";
import FeaturedWorks from "../components/FeaturedWorks";
import ContactComponent from "../components/ContactComponent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <HeroIntroduction />
      <HeroServices />
      <Process />
      <Sponsors />
      <FeaturedWorks />
      <ContactComponent />
    </div>
  );
}
