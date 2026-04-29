import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./components/LoginScreen";
import { BootScreen } from "./components/BootScreen";
import { SimpleDashboard } from "./components/SimpleDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginScreen,
  },
  {
    path: "/boot",
    Component: BootScreen,
  },
  {
    path: "/dashboard",
    Component: SimpleDashboard,
  },
]);
