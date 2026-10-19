import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import terms from "@/data/solar-terms.json";
import tz from "@/data/seoul-tz.json";
import { requireAdmin } from "@/lib/admin/guard";
import { logout } from "./actions";

export const metadata: Metadata = { title: "관리 — 사주·타로", robots: { index: false, follow: false } };

const LINKS = [
  { href: "/sources", title: "데이터 출처", description: "계산 데이터·라이선스·격국 규칙 근거" },
  { href: "/tarot/cards", title: "카드 78장", description: "정·역방향 풀이와 웨이트 원전 대조" },
];

async function AdminHome() {
  await requireAdmin("/admin");
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">관리</h1>
        <form action={logout}>
          <button type="submit" className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-accent">로그아웃</button>
        </form>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-line bg-surface p-5 hover:border-accent">
            <h2 className="font-semibold">{l.title}</h2>
            <p className="mt-1 text-sm text-muted">{l.description}</p>
          </Link>
        ))}
      </div>
      <section className="rounded-xl border border-line bg-surface p-5 text-sm">
        <h2 className="mb-3 font-semibold">데이터 버전</h2>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
          <dt className="text-muted">절기 테이블</dt>
          <dd className="min-w-0 break-words">{terms.meta.range.join("–")} · {terms.meta.generator}</dd>
          <dt className="text-muted">교차 검증</dt>
          <dd className="min-w-0 break-words">{terms.meta.crossCheck}</dd>
          <dt className="text-muted">표준시</dt>
          <dd className="min-w-0 break-words">{tz.meta.source}</dd>
        </dl>
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense>
      <AdminHome />
    </Suspense>
  );
}
