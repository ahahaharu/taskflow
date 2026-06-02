import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/services/auth";

export function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name?: string;
  }) {
    const { hasSession } = await signUp(email, password, name ?? "");
    if (hasSession) {
      toast.success("Account created");
      navigate("/");
    } else {
      toast.success(
        "Account created. Check your email to confirm, then sign in.",
      );
      navigate("/login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
            TaskFlow
          </h1>
          <p className="mt-1 text-sm text-ink-2">Make a workspace your own.</p>
        </div>
        <div className="rounded-card border border-line bg-card p-7 shadow-paper">
          <h2 className="mb-5 text-base font-semibold text-ink">
            Create your account
          </h2>
          <AuthForm mode="register" onSubmit={handleRegister} />
        </div>
        <p className="mt-5 text-center text-sm text-ink-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
