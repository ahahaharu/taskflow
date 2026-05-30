import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/shared/Spinner";

export function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
