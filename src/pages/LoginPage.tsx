import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/services/auth";

export function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    await signIn(email, password);
    navigate("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Sign in to TaskFlow
        </h1>
        <AuthForm mode="login" onSubmit={handleLogin} />
        <p className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link
            to="/register"
            className="font-medium text-slate-900 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
