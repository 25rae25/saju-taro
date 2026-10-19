import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** 데이터 출처는 관리자만 본다 (proxy 1차 확인 + 여기서 2차 확인) */
async function AdminOnly({ children }: { children: React.ReactNode }) {
  await requireAdmin("/sources");
  return children;
}

export default function SourcesLayout({ children }: LayoutProps<"/sources">) {
  return (
    <Suspense>
      <AdminOnly>{children}</AdminOnly>
    </Suspense>
  );
}
