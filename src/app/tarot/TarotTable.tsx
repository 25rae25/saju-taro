"use client";

import { useState } from "react";
import { CARDS } from "@/data/tarot/cards";
import { SPREADS } from "@/data/tarot/spreads";
import { draw, type Drawn } from "@/lib/tarot/draw";
import CardImage from "./CardImage";

export default function TarotTable() {
  const [spreadId, setSpreadId] = useState(SPREADS[0].id);
  const [allowReversed, setAllowReversed] = useState(true);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<{ spreadId: string; question: string; drawn: Drawn[] } | null>(null);

  const spread = SPREADS.find((s) => s.id === spreadId)!;
  const shown = result ? SPREADS.find((s) => s.id === result.spreadId)! : null;

  function onDraw() {
    setResult({ spreadId, question: question.trim(), drawn: draw(CARDS.length, spread.positions.length, allowReversed) });
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap gap-2">
          {SPREADS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpreadId(s.id)}
              className={`rounded-md border px-3 py-1.5 text-sm ${s.id === spreadId ? "border-tarot bg-tarot-soft text-tarot" : "border-line"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">{spread.description}</p>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="마음속 질문 (선택) — 예: 이번 달 일의 흐름은?"
          className="w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:border-tarot focus:outline-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={allowReversed} onChange={(e) => setAllowReversed(e.target.checked)} /> 역방향 포함
          </label>
          <button type="button" onClick={onDraw} className="rounded-md bg-tarot px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:text-black">
            {result ? "다시 섞고 뽑기" : "78장 섞고 뽑기"}
          </button>
        </div>
      </div>

      {result && shown && (
        <section aria-live="polite" className="grid gap-4">
          {result.question && <p className="text-sm">질문: <span className="font-medium">{result.question}</span></p>}
          <div className={`grid gap-4 ${shown.positions.length === 3 ? "md:grid-cols-3" : "mx-auto max-w-md"}`}>
            {result.drawn.map((d, i) => {
              const card = CARDS[d.index];
              const side = d.reversed ? card.reversed : card.upright;
              const pos = shown.positions[i];
              return (
                <article key={`${pos.key}-${card.id}`} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
                  <header>
                    <div className="text-xs font-semibold text-tarot">{pos.label}</div>
                    <div className="text-xs text-muted">{pos.description}</div>
                  </header>
                  <div className="mx-auto w-40 sm:w-48">
                    <CardImage card={card} reversed={d.reversed} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif text-lg font-semibold">{card.nameKo}</h3>
                    <div className="text-xs text-muted">
                      {card.nameEn} · {d.reversed ? "역방향" : "정방향"}
                    </div>
                  </div>
                  <ul className="flex flex-wrap justify-center gap-1.5">
                    {side.keywords.map((k) => (
                      <li key={k} className="rounded-full bg-tarot-soft px-2 py-0.5 text-xs text-tarot">{k}</li>
                    ))}
                  </ul>
                  <p className="text-sm leading-6">{side.meaning}</p>
                  <details className="text-xs text-muted">
                    <summary className="cursor-pointer">웨이트 원전 (1911)</summary>
                    <p className="mt-2 italic">{d.reversed ? card.waite.reversed : card.waite.upright}</p>
                    <a href={card.waite.source} target="_blank" rel="noreferrer" className="mt-1 inline-block underline">출처</a>
                  </details>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
