import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

interface AuthFormValues {
  email: string;
  password: string;
  name?: string;
}

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

const inputClass =
  "rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500";

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ email, password, name: isRegister ? name : undefined });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isRegister && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {submitting ? "Please wait…" : isRegister ? "Sign up" : "Sign in"}
      </button>
    </form>
  );
}
