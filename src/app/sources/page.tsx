import type { Metadata } from "next";
import terms from "@/data/solar-terms.json";
import tz from "@/data/seoul-tz.json";
import { GYEOK_RULES, GYEOK_SOURCES } from "@/lib/saju/gyeokguk";

export const metadata: Metadata = { title: "데이터 출처 — 사주·타로" };

const ROWS: { what: string; source: string; license: string; href?: string }[] = [
  { what: "24절기 시각 (1899–2101)", source: `${terms.meta.generator}; 교차 검증 ${terms.meta.crossCheck}`, license: "MIT" },
  { what: "절기 검증 기준", source: "한국천문연구원 달력자료 2021–2028 (192개, 분 단위)", license: "검증 전용", href: "https://astro.kasi.re.kr/kor/life/post/calendarData" },
  { what: "음력 ↔ 양력", source: "korean-lunar-calendar 0.4.0 (한국천문연구원 기준 데이터)", license: "MIT", href: "https://github.com/usingsky/korean_lunar_calendar_js" },
  { what: "한국 표준시·서머타임 변천", source: tz.meta.source, license: "퍼블릭 도메인", href: "https://www.iana.org/time-zones" },
  { what: "격국 판정 규칙", source: "沈孝瞻, 『子平眞詮』(청 건륭 연간) 論用神·論用神變化·論陽刃 — 아래 표", license: "퍼블릭 도메인" },
  { what: "진태양시 균시차", source: "astronomy-engine 2.1.19 (태양 시각)", license: "MIT", href: "https://github.com/cosinekitty/astronomy" },
  { what: "타로 원전 의미", source: "A. E. Waite, The Pictorial Key to the Tarot (1911)", license: "퍼블릭 도메인", href: "https://sacred-texts.com/tarot/pkt/index.htm" },
  { what: "타로 카드 그림", source: "Pamela Colman Smith, 1909 초판 스캔 — Wikimedia Commons ‘Roses & Lilies’", license: "퍼블릭 도메인", href: "https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)" },
  { what: "타로 한국어 풀이", source: "이 프로젝트에서 직접 작성", license: "–" },
];

export default function SourcesPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="mb-1 font-serif text-2xl font-semibold">데이터 출처</h1>
        <p className="text-sm text-muted">계산에 쓰는 모든 데이터와 라이선스입니다. 자세한 규칙과 검증 내용은 저장소의 docs/DATA.md에 있습니다.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="p-3 font-medium">데이터</th>
              <th className="p-3 font-medium">출처</th>
              <th className="p-3 font-medium">라이선스</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.what} className="border-t border-line align-top">
                <td className="p-3 font-medium">{r.what}</td>
                <td className="p-3">{r.href ? <a href={r.href} target="_blank" rel="noreferrer" className="underline">{r.source}</a> : r.source}</td>
                <td className="p-3 whitespace-nowrap">{r.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section id="gyeokguk" className="grid min-w-0 gap-3">
        <h2 className="font-serif text-lg font-semibold">격국 판정 규칙 (자평진전식 내격)</h2>
        <p className="text-sm text-muted">
          위에서부터 처음 맞는 규칙으로 격을 정합니다. 투출은 연간·월간·시간에 월지 지장간과 같은 천간이 있는 것만 칩니다(일간 제외). 외격·용신·삼합 변격은 판정하지 않습니다.
        </p>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="p-3 font-medium">순서</th>
                <th className="p-3 font-medium">조건</th>
                <th className="p-3 font-medium">격</th>
                <th className="p-3 font-medium">근거</th>
              </tr>
            </thead>
            <tbody>
              {GYEOK_RULES.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="p-3 tabular-nums">{r.order}</td>
                  <td className="p-3">{r.when}</td>
                  <td className="p-3">{r.then}</td>
                  <td className="p-3">
                    {[...new Set(r.sources.map((id) => GYEOK_SOURCES[id].chapter))].map((c) => (
                      <span key={c} className="block whitespace-nowrap">{c}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="grid gap-2 text-sm">
          {Object.entries(GYEOK_SOURCES).map(([id, q]) => (
            <li key={id} className="rounded-lg border border-line bg-surface p-3">
              <div className="text-xs text-muted">
                『{q.work}』 {q.chapter}
                {!q.checked && " · 온라인 전사본과 대조하지 못함"}
              </div>
              <div className="mt-1 font-serif">{q.quote}</div>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-muted">
        “Rider-Waite” 등은 U.S. Games Systems의 상표이며, 이 앱은 1909년 원판(퍼블릭 도메인)만 사용하고 1971년 재채색판·카드 뒷면은 사용하지 않습니다.
      </p>
    </div>
  );
}
