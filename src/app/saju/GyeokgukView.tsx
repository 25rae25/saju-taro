import { BRANCHES, STEMS, type Element } from "@/lib/saju/constants";
import { STEM_POSITION_LABEL, type Gyeokguk } from "@/lib/saju/gyeokguk";

const ELEMENT_TEXT: Record<Element, string> = {
  목: "text-wood",
  화: "text-fire",
  토: "text-earth",
  금: "text-metal",
  수: "text-water",
};

/** '격' 섹션 본문 — 판정 결과, 월지 지장간별 투출, 판정 근거 */
export default function GyeokgukView({ g }: { g: Gyeokguk }) {
  const month = BRANCHES[g.monthBranch];
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-serif text-3xl leading-none text-accent">{g.hanja}</span>
        <span className="text-lg font-semibold">{g.name}</span>
        {g.alias && <span className="text-xs text-muted">{g.alias}</span>}
      </div>

      <div className="min-w-0 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="mb-1 text-left text-xs text-muted">
            월지 <span className={`font-serif ${ELEMENT_TEXT[month.element]}`}>{month.hanja}</span> {month.ko}의 지장간
          </caption>
          <thead className="text-xs text-muted">
            <tr>
              <th className="py-1 pr-3 font-medium">구분</th>
              <th className="py-1 pr-3 font-medium">천간</th>
              <th className="py-1 pr-3 font-medium">십신</th>
              <th className="py-1 pr-3 font-medium">투출</th>
              <th className="py-1 font-medium">판정</th>
            </tr>
          </thead>
          <tbody>
            {g.hidden.map((h) => {
              const s = STEMS[h.stem];
              return (
                <tr key={h.role} className={`border-t border-line ${h.chosen ? "bg-accent-soft font-semibold" : ""}`}>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    {h.role} <span className="text-xs font-normal text-muted">{h.days}일</span>
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    <span className={`font-serif ${ELEMENT_TEXT[s.element]}`}>{s.hanja}</span> {s.ko}
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">{h.tenGod}</td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    {h.revealedAt.length ? h.revealedAt.map((p) => STEM_POSITION_LABEL[p]).join("·") : <span className="text-muted">–</span>}
                  </td>
                  <td className="py-1.5 text-xs">{h.chosen ? <span className="text-accent">격으로 씀</span> : <span className="font-normal text-muted">{h.note ?? ""}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ol className="grid list-decimal gap-1.5 pl-5 text-sm">
        {g.reasons.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>

      {g.byHourBranch && (
        <div className="rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm text-warn">
          <p className="mb-1 font-medium">시지별 격 (출생 시각을 모를 때)</p>
          <ul className="grid gap-0.5">
            {g.byHourBranch.map((x) => (
              <li key={x.name}>
                {x.hourBranches.map((b) => BRANCHES[b].ko).join("·")}시 → {x.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted">
        자평진전(子平眞詮)식 내격(8격 + 건록·양인·월겁)만 판정합니다. 외격(종격·화기격·일행득기격 등)과 용신은 판정하지 않습니다.
      </p>
    </div>
  );
}
