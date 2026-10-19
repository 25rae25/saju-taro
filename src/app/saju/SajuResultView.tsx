import { CORRECTION_LABEL, type PillarInfo, type SajuResult } from "@/lib/saju";
import { BRANCHES, ELEMENT_HANJA, ELEMENTS, STEMS, type Element } from "@/lib/saju/constants";
import { seoulOffsetAt } from "@/lib/saju/time";
import GyeokgukView from "./GyeokgukView";

const ELEMENT_TEXT: Record<Element, string> = {
  목: "text-wood",
  화: "text-fire",
  토: "text-earth",
  금: "text-metal",
  수: "text-water",
};
const ELEMENT_BG: Record<Element, string> = {
  목: "bg-wood",
  화: "bg-fire",
  토: "bg-earth",
  금: "bg-metal",
  수: "bg-water",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** UTC 순간 → 당시 서울 시계 시각 문자열 */
function clock(utcMs: number, withSeconds = false) {
  const { offsetMin, dst } = seoulOffsetAt(utcMs);
  const d = new Date(utcMs + offsetMin * 60000);
  const s = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  const tz = offsetMin === 540 ? "" : ` (UTC+${Math.floor(offsetMin / 60)}:${pad(Math.round(offsetMin % 60))}${dst ? " 서머타임" : ""})`;
  return (withSeconds ? `${s}:${pad(d.getUTCSeconds())}` : s) + tz;
}

function yearMonth(utcMs: number) {
  const d = new Date(utcMs + 9 * 3600e3);
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}`;
}

function Section({ title, children, note }: { title: string; children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        {note && <p className="text-xs text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Glyph({ hanja, ko, element, size = "lg" }: { hanja: string; ko: string; element: Element; size?: "lg" | "sm" }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`font-serif leading-none ${ELEMENT_TEXT[element]} ${size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl"}`}>{hanja}</span>
      <span className="mt-1 text-center text-[11px] text-muted sm:text-xs">{ko}</span>
    </div>
  );
}

function PillarColumn({ title, p, isYear }: { title: string; p: PillarInfo | null; isYear?: boolean }) {
  if (!p) {
    return (
      <div className="flex min-w-0 flex-col items-center gap-3 rounded-lg border border-dashed border-line px-1 py-3 text-muted sm:p-3">
        <div className="text-xs font-medium">{title}</div>
        <div className="flex flex-1 items-center text-sm">시간 모름</div>
      </div>
    );
  }
  const stem = STEMS[p.pillar.stem];
  const branch = BRANCHES[p.pillar.branch];
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-line px-1 py-3 sm:p-3">
      <div className="text-xs font-medium text-muted">{title}</div>
      <div className="text-xs">{p.stemTenGod ?? <span className="font-semibold text-accent">일간</span>}</div>
      <Glyph hanja={stem.hanja} ko={`${stem.ko} · ${stem.yinYang}${stem.element}`} element={stem.element} />
      <Glyph hanja={branch.hanja} ko={`${branch.ko} · ${branch.yinYang}${branch.element}${isYear ? ` · ${branch.animal}띠` : ""}`} element={branch.element} />
      <div className="text-xs">{p.branchTenGod}</div>
      <div className="w-full border-t border-line pt-2 text-center text-[11px] leading-5 text-muted">
        <div className="flex flex-wrap justify-center gap-x-1.5">
          {p.hidden.map((h, i) => (
            <span key={i} className="whitespace-nowrap">
              <span className={ELEMENT_TEXT[STEMS[h.stem].element]}>{h.hanja}</span>
              {h.days}
            </span>
          ))}
        </div>
        <div>{p.twelveStage}</div>
      </div>
    </div>
  );
}

function LuckCell({ head, p, sub, current }: { head: string; p: PillarInfo; sub: string; current?: boolean }) {
  const stem = STEMS[p.pillar.stem];
  const branch = BRANCHES[p.pillar.branch];
  return (
    <div className={`flex min-w-16 flex-col items-center gap-1 rounded-lg border p-2 ${current ? "border-accent bg-accent-soft" : "border-line"}`}>
      <div className="text-xs font-semibold">{head}</div>
      <div className="text-[11px] text-muted">{p.stemTenGod}</div>
      <span className={`font-serif text-2xl leading-none ${ELEMENT_TEXT[stem.element]}`}>{stem.hanja}</span>
      <span className={`font-serif text-2xl leading-none ${ELEMENT_TEXT[branch.element]}`}>{branch.hanja}</span>
      <div className="text-[11px] text-muted">{p.branchTenGod}</div>
      <div className="text-[11px] text-muted">{p.twelveStage}</div>
      <div className="text-[11px] text-muted">{sub}</div>
    </div>
  );
}

export default function SajuResultView({ r, now }: { r: SajuResult; now: number }) {
  const { input } = r;
  const total = ELEMENTS.reduce((a, e) => a + r.elements[e], 0);
  const currentDaeun = r.daeun.items.findIndex((d, i) => now >= d.startUtcMs && (i === 9 || now < r.daeun.items[i + 1].startUtcMs));
  const thisYear = new Date(now + 9 * 3600e3).getUTCFullYear();

  return (
    <div className="mt-8 grid grid-cols-1 gap-6">
      {/* 입력 요약 */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span>
          양력 {r.solarDate.year}-{pad(r.solarDate.month)}-{pad(r.solarDate.day)}
          {r.lunarDate && (
            <span className="text-muted">
              {" "}(음력 {r.lunarDate.year}-{pad(r.lunarDate.month)}-{pad(r.lunarDate.day)}{r.lunarDate.isLeapMonth ? " 윤달" : ""})
            </span>
          )}
        </span>
        {r.timeKnown && input.time && (
          <span>
            {pad(input.time.hour)}:{pad(input.time.minute)} 출생 → {CORRECTION_LABEL[input.correction]} {r.solarTime && `${pad(r.solarTime.hour)}:${pad(r.solarTime.minute)}`}
            <span className="text-muted"> ({r.correctionMinutes! > 0 ? "+" : ""}{r.correctionMinutes}분)</span>
          </span>
        )}
        <span className="text-muted">{input.gender === "M" ? "남" : "여"} · 자시 기준 {input.dayBoundary}시</span>
      </div>

      {r.warnings.length > 0 && (
        <ul className="grid gap-1.5 rounded-xl border border-warn/40 bg-warn-soft p-4 text-sm text-warn">
          {r.warnings.map((w, i) => (
            <li key={i}>⚠ {w}</li>
          ))}
        </ul>
      )}

      <Section title="사주 명식" note="천간·지지 위아래 글자는 일간 기준 십신, 아래는 지장간(여기·중기·정기 일수)과 12운성">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <PillarColumn title="시주" p={r.pillars.hour} />
          <PillarColumn title="일주" p={r.pillars.day} />
          <PillarColumn title="월주" p={r.pillars.month} />
          <PillarColumn title="연주" p={r.pillars.year} isYear />
        </div>
      </Section>

      <Section title="격국" note="자평진전식 · 월지 지장간의 투출로 판정">
        <GyeokgukView g={r.gyeokguk} />
      </Section>

      <Section title="오행 분포" note={`천간·지지 ${total}글자 기준 (지장간 제외)`}>
        <div className="grid gap-2">
          {ELEMENTS.map((e) => (
            <div key={e} className="flex items-center gap-3 text-sm">
              <span className={`w-12 font-medium ${ELEMENT_TEXT[e]}`}>{e} {ELEMENT_HANJA[e]}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
                <div className={`h-full rounded-full ${ELEMENT_BG[e]}`} style={{ width: `${(r.elements[e] / 8) * 100}%` }} />
              </div>
              <span className="w-6 text-right tabular-nums">{r.elements[e]}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={`대운 (${r.daeun.forward ? "순행" : "역행"}, 대운수 ${r.daeun.number})`}
        note={`정확한 시작: 만 ${r.daeun.startAge.years}세 ${r.daeun.startAge.months}개월 (${yearMonth(r.daeun.startUtcMs)})`}
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {r.daeun.items.map((d, i) => (
            <LuckCell key={d.order} head={`${d.label}세`} p={d} sub={yearMonth(d.startUtcMs)} current={i === currentDaeun} />
          ))}
        </div>
      </Section>

      <Section title="세운 (해마다 운)" note="해의 간지는 입춘(2월 4일 무렵)에 바뀝니다">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {r.seun.map((s) => (
            <LuckCell key={s.year} head={`${s.year}`} p={s} sub={s.ko} current={s.year === thisYear} />
          ))}
        </div>
      </Section>

      <details className="rounded-xl border border-line bg-surface p-5 text-sm">
        <summary className="cursor-pointer font-semibold">계산 근거</summary>
        <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
          <dt className="text-muted">출생 순간</dt>
          <dd>
            {r.timeKnown ? clock(r.birthUtcMs) : "시간 모름 — 정오로 가정"} · UTC {new Date(r.birthUtcMs).toISOString().slice(0, 16).replace("T", " ")}
          </dd>
          <dt className="text-muted">연주 기준</dt>
          <dd>
            {r.pillars.year.ko}년 — 입춘 {clock(r.ipchun.utcMs, true)} 이후 출생
          </dd>
          <dt className="text-muted">월주 구간</dt>
          <dd>
            {r.jie.prev.name} {clock(r.jie.prev.utcMs, true)} ~ {r.jie.next.name} {clock(r.jie.next.utcMs, true)}
          </dd>
          {r.timeKnown && (
            <>
              <dt className="text-muted">시간 보정</dt>
              <dd>
                {CORRECTION_LABEL[input.correction]} · 경도 {input.longitude.toFixed(3)}°E · {r.correctionMinutes}분 → {r.solarTime && `${r.solarTime.year}-${pad(r.solarTime.month)}-${pad(r.solarTime.day)} ${pad(r.solarTime.hour)}:${pad(r.solarTime.minute)}:${pad(r.solarTime.second)}`}
              </dd>
            </>
          )}
          <dt className="text-muted">대운</dt>
          <dd>
            {r.pillars.year.ko}년({STEMS[r.pillars.year.pillar.stem].yinYang}) {input.gender === "M" ? "남" : "여"} → {r.daeun.forward ? "순행: 다음 절까지" : "역행: 이전 절부터"} {r.daeun.deltaDays.toFixed(2)}일 ÷ 3 = {(r.daeun.deltaDays / 3).toFixed(2)} → 반올림 {r.daeun.number}
          </dd>
        </dl>
        {r.alternatives.length > 0 && (
          <table className="mt-4 w-full text-left text-xs">
            <thead className="text-muted">
              <tr>
                <th className="py-1 font-medium">보정 방식</th>
                <th className="py-1 font-medium">자시 기준</th>
                <th className="py-1 font-medium">일주</th>
                <th className="py-1 font-medium">시주</th>
              </tr>
            </thead>
            <tbody>
              {r.alternatives.map((a) => {
                const selected = a.correction === input.correction && a.dayBoundary === input.dayBoundary;
                return (
                  <tr key={`${a.correction}-${a.dayBoundary}`} className={`border-t border-line ${selected ? "font-semibold text-accent" : ""}`}>
                    <td className="py-1">{CORRECTION_LABEL[a.correction]}</td>
                    <td className="py-1">{a.dayBoundary}시</td>
                    <td className="py-1">{a.day}</td>
                    <td className="py-1">{a.hour}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </details>
    </div>
  );
}
