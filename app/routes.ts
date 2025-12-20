import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout.tsx", [
    index("./routes/home.tsx"),
    route("du-an", "./routes/works.tsx"),
    route("lien-he", "./routes/contact.tsx"),
    route("du-an/:slug", "./routes/works.$slug.tsx"),
  ]),
] satisfies RouteConfig;
