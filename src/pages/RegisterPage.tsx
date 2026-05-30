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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Create your account
        </h1>
        <AuthForm mode="register" onSubmit={handleRegister} />
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
