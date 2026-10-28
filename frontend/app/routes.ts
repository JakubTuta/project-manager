import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("home", "routes/home.tsx", { id: "home" }),
  route("project/:name", "routes/project.tsx"),
] satisfies RouteConfig;
