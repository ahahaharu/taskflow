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
  "rounded-control border border-line bg-card px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors duration-150 focus:border-line-strong focus:ring-2 focus:ring-accent/15";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {isRegister && (
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      )}
      <input
        type="email"
        placeholder="you@example.com"
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
        className="mt-2 rounded-control bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
      >
        {submitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
