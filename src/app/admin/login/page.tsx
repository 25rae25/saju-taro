import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "관리자 로그인 — 사주·타로", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 font-serif text-2xl font-semibold">관리자 로그인</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
