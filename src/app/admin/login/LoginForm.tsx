"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "../actions";

const field = "w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none";

export default function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="grid gap-4 rounded-xl border border-line bg-surface p-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="user" className="mb-1 block text-xs font-medium text-muted">아이디</label>
        <input id="user" name="user" autoComplete="username" required className={field} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-xs font-medium text-muted">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      </div>
      {state?.error && <p className="rounded-md bg-accent-soft p-3 text-sm text-accent" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
