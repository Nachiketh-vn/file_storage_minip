import { useAuth } from "@/context/auth-context";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function ProtectedPage() {
  const { user } = useAuth();
  console.log("user: ", user);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
