import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "gray" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
}

const backgrounds = {
  white: "bg-white",
  gray: "bg-gray-50",
  gradient: "bg-gradient-to-br from-blue-50 to-purple-50",
};

const paddings = {
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-24",
  xl: "py-20 sm:py-24 lg:py-32",
};

export default function Section({
  children,
  className = "",
  background = "white",
  padding = "md",
}: SectionProps) {
  return (
    <section
      className={`${backgrounds[background]} ${paddings[padding]} ${className}`}
    >
      {children}
    </section>
  );
}
