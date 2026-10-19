import type { Metadata } from "next";
import { CARDS } from "@/data/tarot/cards";
import type { Suit } from "@/lib/tarot/types";
import CardImage from "../CardImage";

export const metadata: Metadata = { title: "카드 78장 — 사주·타로" };

const GROUPS: { title: string; suit: Suit | null }[] = [
  { title: "메이저 아르카나 (22장)", suit: null },
  { title: "완드 (14장) — 불, 의지·행동", suit: "wands" },
  { title: "컵 (14장) — 물, 감정·관계", suit: "cups" },
  { title: "소드 (14장) — 공기, 생각·갈등", suit: "swords" },
  { title: "펜타클 (14장) — 흙, 돈·몸·현실", suit: "pentacles" },
];

export default function CardsPage() {
  return (
    <div className="grid gap-10">
      <div>
        <h1 className="mb-1 font-serif text-2xl font-semibold">카드 78장</h1>
        <p className="text-sm text-muted">정·역방향 풀이와 웨이트 『The Pictorial Key to the Tarot』(1911) 원문을 함께 실었습니다.</p>
      </div>
      {GROUPS.map((g) => (
        <section key={g.title}>
          <h2 className="mb-4 text-lg font-semibold">{g.title}</h2>
          <div className="grid gap-4">
            {CARDS.filter((c) => c.suit === g.suit).map((c) => (
              <article key={c.id} id={c.id} className="grid gap-4 rounded-xl border border-line bg-surface p-4 sm:grid-cols-[96px_1fr]">
                <div className="w-24"><CardImage card={c} /></div>
                <div className="grid gap-3 text-sm">
                  <h3 className="font-serif text-base font-semibold">
                    {c.nameKo} <span className="text-xs font-normal text-muted">{c.nameEn}</span>
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {(["upright", "reversed"] as const).map((o) => (
                      <div key={o}>
                        <div className="mb-1 text-xs font-semibold text-tarot">{o === "upright" ? "정방향" : "역방향"} · {c[o].keywords.join(", ")}</div>
                        <p className="leading-6">{c[o].meaning}</p>
                        <p className="mt-1 text-xs italic text-muted">
                          Waite: {c.waite[o] || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
