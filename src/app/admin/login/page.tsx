"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSCODE) {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin");
      return;
    }

    setError("Wrong passcode");
  }

  return (
    <section className="section-space">
      <div className="shell flex min-h-[70vh] items-center justify-center">
        <div className="panel w-full max-w-md space-y-5 p-8">
          <p className="eyebrow">admin</p>
          <h1 className="display-title text-5xl lowercase">bacibaci</h1>
          <input
            className="field"
            type="password"
            placeholder="Enter admin passcode"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="button" className="button-primary w-full" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </section>
  );
}
