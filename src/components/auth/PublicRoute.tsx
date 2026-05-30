import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/shared/Spinner";

export function PublicRoute() {
  const { session, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (session) return <Navigate to="/" replace />;
  return <Outlet />;
}
