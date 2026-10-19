import type { Metadata } from "next";
import terms from "@/data/solar-terms.json";
import tz from "@/data/seoul-tz.json";

export const metadata: Metadata = { title: "데이터 출처 — 사주·타로" };

const ROWS: { what: string; source: string; license: string; href?: string }[] = [
  { what: "24절기 시각 (1899–2101)", source: `${terms.meta.generator}; 교차 검증 ${terms.meta.crossCheck}`, license: "MIT" },
  { what: "절기 검증 기준", source: "한국천문연구원 달력자료 2021–2028 (192개, 분 단위)", license: "검증 전용", href: "https://astro.kasi.re.kr/kor/life/post/calendarData" },
  { what: "음력 ↔ 양력", source: "korean-lunar-calendar 0.4.0 (한국천문연구원 기준 데이터)", license: "MIT", href: "https://github.com/usingsky/korean_lunar_calendar_js" },
  { what: "한국 표준시·서머타임 변천", source: tz.meta.source, license: "퍼블릭 도메인", href: "https://www.iana.org/time-zones" },
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
      <p className="text-xs text-muted">
        “Rider-Waite” 등은 U.S. Games Systems의 상표이며, 이 앱은 1909년 원판(퍼블릭 도메인)만 사용하고 1971년 재채색판·카드 뒷면은 사용하지 않습니다.
      </p>
    </div>
  );
}
