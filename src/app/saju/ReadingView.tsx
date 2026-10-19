import type { SajuReading } from "@/lib/saju/reading";

/** '풀이' 섹션 본문 — 상담 흐름 순서의 규칙 기반 문장 */
export default function ReadingView({ reading }: { reading: SajuReading }) {
  return (
    <div className="grid min-w-0 gap-6">
      <p className="min-w-0 rounded-lg bg-accent-soft p-3 text-xs leading-5 break-words text-muted">{reading.disclaimer}</p>
      <ol className="grid min-w-0 gap-6">
        {reading.sections.map((s, i) => (
          <li key={s.id} className="grid min-w-0 gap-2.5">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h3 className="font-semibold">
                <span className="mr-1.5 tabular-nums text-accent">{i + 1}.</span>
                {s.title}
              </h3>
              <span className="min-w-0 text-xs break-words text-muted">{s.basis}</span>
            </div>
            {s.paragraphs.map((p) => (
              <div key={p.rule} className="grid min-w-0 gap-0.5 text-sm leading-6 break-words">
                {p.label && <div className="text-xs font-semibold text-accent">{p.label}</div>}
                <p>{p.text}</p>
              </div>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
