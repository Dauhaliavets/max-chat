import { createBrowserRouter } from "react-router";
import { ChatLayout } from "../../pages/chat/ChatLayout";
import { LoginPage } from "../../pages/login/LoginPage";
import { ProtectedRoute } from "./ui/ProtectudRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: ChatLayout,
        children: [{ path: ":chatId", Component: ChatLayout }],
      },
    ],
  },
]);

export { router };
