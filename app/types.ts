import type { ReactNode } from "react";

//HEADER TYPE
export type NavItem = {
  label: string;
  href: string;
};

// WORK TYPE
export type WorkCategory = "all" | "smm" | "branding" | "kol" | "production";

export type WorkPortfolio = {
  //overview infos
  id: number;
  client: ClientInfo;
  thumbnail: string;
  slug: string;
  category: WorkCategory;

  //contents
  overview: string;
  scope: string[];
  servicesUsed: WorkCategory[];
  results: string[];

  //MEDIA: IMAGES/VIDEOS
  mediaSections: MediaSections[];

  //SOCIAL LINKS
  socialLinks: SocialLink[];

  featured?: boolean;
};

//CLIENT INFORMATIONS
export type ClientInfo = {
  id: string;
  name: string;
  industry: string;
  logo?: string;
};

//MEDIA TYPE
export type MediaType = "image" | "video";
export type MediaItem = {
  type: MediaType;
  url: string;
  caption?: string;
};
export type MediaSections = {
  title: string;
  items: MediaItem[];
};

//SOCIAL SECTIONS
export type SocialLink = {
  platform: "facebook" | "instagram" | "tiktok" | "youtube" | "other";
  url: string;
  labels?: string;
};

//HERO SECTION HOMEPAGE TYPE
export type ServiceFeature = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  icon?: string;
  lucideIcon: ReactNode;
};

//PROCESS
export type ProcessType = {
  id: string;
  step: string;
  description: string;
};

//SPONSORS
export type SponsorType = {
  id: string;
  name: string;
  logo: string; //SVG
};

//Contact
export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;
export type SubmissionStatus = "idle" | "error" | "submitting" | "success";
