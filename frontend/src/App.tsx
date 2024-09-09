import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import DashboardLayout from "@/pages/dashboard/dashboard-layout";
import AuthProvider from "./context/auth-context";
import ProtectedPage from "./pages/protected-page/protected-page";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    index: true,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <ProtectedPage />,
    children: [
      {
        path: "app",
        element: <DashboardLayout />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
