import { lazy } from "react";
import { useRoutes } from "react-router-dom";

// Import components
const Home = lazy(() => import("./components/Home"));
// ----------------------------------------------------------------------------------

export default function Routes() {
  return useRoutes([
    {
      path: "",
      element: <Home />,
    },
  ]);
}
