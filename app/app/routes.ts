import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./routes/public-layout.tsx", [
    index("routes/home.tsx"),
    route("entrar", "./routes/auth.tsx"),
  ])
] satisfies RouteConfig;
