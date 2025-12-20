import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
};

export default function Container({
  children,
  size = "lg",
  className = "",
}: ContainerProps) {
  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
