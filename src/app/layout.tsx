import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "사주·타로",
  description: "절기·표준시 변천까지 검증한 만세력과 웨이트–스미스 1909 덱 타로",
};

const NAV = [
  { href: "/saju", label: "사주" },
  { href: "/tarot", label: "타로" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
              사주·타로
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-foreground">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-line py-4 text-center text-xs text-muted">
          재미와 성찰을 위한 참고 정보이며, 의료·법률·재정 판단을 대신하지 않습니다.
        </footer>
      </body>
    </html>
  );
}
