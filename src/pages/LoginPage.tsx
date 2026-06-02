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
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
            TaskFlow
          </h1>
          <p className="mt-1 text-sm text-ink-2">A calmer place for work.</p>
        </div>
        <div className="rounded-card border border-line bg-card p-7 shadow-paper">
          <h2 className="mb-5 text-base font-semibold text-ink">
            Sign in to your account
          </h2>
          <AuthForm mode="login" onSubmit={handleLogin} />
        </div>
        <p className="mt-5 text-center text-sm text-ink-2">
          No account?{" "}
          <Link
            to="/register"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
