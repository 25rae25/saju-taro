import type { Metadata } from "next";
import Link from "next/link";
import TarotTable from "./TarotTable";

export const metadata: Metadata = { title: "타로 — 사주·타로" };

export default function TarotPage() {
  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold">타로</h1>
      <p className="mb-6 text-sm text-muted">
        웨이트–스미스 1909 덱(그림 Pamela Colman Smith) 78장을 암호학적 난수로 섞어 뽑습니다.{" "}
        <Link href="/tarot/cards" className="underline">78장 전체 보기</Link>
      </p>
      <TarotTable />
    </div>
  );
}
