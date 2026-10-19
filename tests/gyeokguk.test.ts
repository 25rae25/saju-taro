/**
 * 격국 판정 — 자평진전식 내격의 경계 사례.
 * 천간 인덱스: 갑0 을1 병2 정3 무4 기5 경6 신7 임8 계9 / 지지 인덱스: 자0 축1 인2 묘3 진4 사5 오6 미7 신8 유9 술10 해11
 * 투출이 판정에 끼지 않게 하려고 빈 자리에는 월지 지장간에 없는 천간을 넣는다.
 */
import { describe, expect, test } from "vitest";
import { computeSaju, type SajuInput } from "@/lib/saju";
import { BRANCHES, tenGod, twelveStage } from "@/lib/saju/constants";
import {
  GOJI, GYEOK_RULES, GYEOK_SOURCES, ROK_BRANCH, WANGJI, YANGIN_BRANCH, judgeGyeokguk, type GyeokInput,
} from "@/lib/saju/gyeokguk";

const [갑, 을, 병, 정, 무, 기, 경, 신, 임, 계] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const [자, 축, 인, 묘, 진, 사, 오, 미, 申, 유, 술, 해] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function judge(dayStem: number, monthBranch: number, year: number, month: number, hour: number | null = null, branches?: number[]) {
  return judgeGyeokguk({ dayStem, monthBranch, stems: { year, month, hour }, branches: branches ?? [monthBranch] });
}
const role = (g: ReturnType<typeof judge>, r: "여기" | "중기" | "정기") => g.hidden.find((h) => h.role === r)!;

describe("월지 지장간 투출 여부", () => {
  // 인(寅) = 여기 무 · 중기 병 · 정기 갑
  test("정기 투출 → 정기 격 (신일간 인월, 갑 투출 → 정재격)", () => {
    const g = judge(신, 인, 갑, 경);
    expect(g.name).toBe("정재격");
    expect(g.rule).toBe("jeonggiReveal");
    expect(role(g, "정기")).toMatchObject({ chosen: true, revealedAt: ["year"] });
  });
  test("정기 미투출·중기 투출 → 중기 격 (辛生寅月 透丙 → 정관격)", () => {
    const g = judge(신, 인, 병, 경);
    expect(g.name).toBe("정관격");
    expect(g.rule).toBe("hiddenReveal");
    expect(role(g, "중기").chosen).toBe(true);
    expect(role(g, "정기").revealedAt).toEqual([]);
  });
  test("정기 미투출·여기 투출 → 여기 격 (壬生戌月 逢辛 → 정인격)", () => {
    // 술(戌) = 여기 신 · 중기 정 · 정기 무
    const g = judge(임, 술, 신, 경);
    expect(g.name).toBe("정인격");
    expect(role(g, "여기")).toMatchObject({ chosen: true, revealedAt: ["year"] });
  });
  test("아무것도 투출하지 않음 → 정기 격 (임일간 술월 → 편관격)", () => {
    const g = judge(임, 술, 경, 계);
    expect(g.name).toBe("편관격");
    expect(g.alias).toContain("칠살격");
    expect(g.rule).toBe("jeonggiDefault");
    expect(g.hidden.every((h) => h.revealedAt.length === 0)).toBe(true);
  });
  test("일간과 같은 천간은 투출로 치지 않음", () => {
    // 갑일간 해월: 해 = 여기 무 · 중기 갑 · 정기 임. 일간 갑만 있음 → 정기 임 편인격
    const g = judge(갑, 해, 경, 을);
    expect(role(g, "중기").revealedAt).toEqual([]);
    expect(g.name).toBe("편인격");
  });
  test("같은 오행이라도 음양이 다르면 투출이 아님 (인월 정기 갑, 천간 을)", () => {
    const g = judge(신, 인, 을, 경);
    expect(role(g, "정기").revealedAt).toEqual([]);
    expect(g.rule).toBe("jeonggiDefault");
  });
  test("월간·시간 투출도 같게 친다", () => {
    expect(judge(신, 인, 경, 갑).name).toBe("정재격");
    expect(judge(신, 인, 경, 경, 병).name).toBe("정관격");
    expect(role(judge(신, 인, 경, 경, 병), "중기").revealedAt).toEqual(["hour"]);
  });
  test("비견·겁재가 투출해도 격이 되지 않음 (병일간 인월, 병 투출 → 정기 갑 편인격)", () => {
    const g = judge(병, 인, 병, 경);
    expect(g.name).toBe("편인격");
    expect(role(g, "중기").note).toContain("비견");
    // 비견 옆에 여기 무(식신)도 투출하면 여기를 씀
    expect(judge(병, 인, 병, 무).name).toBe("식신격");
  });
});

describe("여러 개가 투출한 경우 — 지장간 서열(정기 > 중기 > 여기) 우선", () => {
  test("정기·중기·여기 모두 투출 → 정기", () => {
    const g = judge(신, 인, 무, 병, 갑);
    expect(g.name).toBe("정재격");
    expect(g.hidden.filter((h) => h.chosen).map((h) => h.role)).toEqual(["정기"]);
    expect(role(g, "중기").note).toContain("정기를 먼저");
    expect(role(g, "여기").note).toContain("정기를 먼저");
    expect(g.reasons.some((r) => r.includes("병(丙)·정관") && r.includes("서열"))).toBe(true);
  });
  test("천간 위치는 따지지 않음 — 정기가 연간, 여기가 월간이어도 정기", () => {
    expect(judge(신, 인, 갑, 무).name).toBe("정재격");
  });
  test("정기 미투출, 중기·여기 투출 → 중기", () => {
    const g = judge(신, 인, 무, 경, 병);
    expect(g.name).toBe("정관격");
    expect(role(g, "여기").note).toContain("중기를 먼저");
  });
  test("같은 천간이 두 자리에 투출하면 둘 다 근거에 표시", () => {
    expect(role(judge(신, 인, 갑, 경, 갑), "정기").revealedAt).toEqual(["year", "hour"]);
  });
});

describe("건록·양인·월겁", () => {
  test("건록(祿) 자리 = 12운성 건록 (화토동법)", () => {
    for (let d = 0; d < 10; d++) expect(twelveStage(d, ROK_BRANCH[d])).toBe("건록");
  });
  test("양인(刃) = 양간의 12운성 제왕, 음간은 없음", () => {
    for (let d = 0; d < 10; d++) {
      if (d % 2 === 0) expect(twelveStage(d, YANGIN_BRANCH[d]!)).toBe("제왕");
      else expect(YANGIN_BRANCH[d]).toBeNull();
    }
  });
  test.each([
    [갑, 인], [을, 묘], [병, 사], [정, 오], [무, 사], [기, 오], [경, 申], [신, 유], [임, 해], [계, 자],
  ])("건록격: 일간 %i 월지 %i", (d, m) => {
    expect(judge(d, m, (d + 5) % 10, (d + 5) % 10).name).toBe("건록격");
  });
  test.each([[갑, 묘], [병, 오], [무, 오], [경, 유], [임, 자]])("양인격: 일간 %i 월지 %i", (d, m) => {
    expect(judge(d, m, (d + 5) % 10, (d + 5) % 10).name).toBe("양인격");
  });
  test.each([[을, 인], [정, 사], [신, 申], [계, 해]])("월겁격 (음간의 겁재월): 일간 %i 월지 %i", (d, m) => {
    expect(judge(d, m, (d + 5) % 10, (d + 5) % 10).name).toBe("월겁격");
  });
  test("건록격은 다른 지장간이 투출해도 그대로 (갑일간 인월, 병·무 투출)", () => {
    const g = judge(갑, 인, 병, 무);
    expect(g.name).toBe("건록격");
    expect(g.hidden.some((h) => h.chosen)).toBe(false);
    expect(role(g, "중기").note).toContain("바뀌지 않음");
  });
  test("월겁격도 투출로 바뀌지 않음 (乙生寅月 透戊 — 자평진전도 월겁으로 부름)", () => {
    expect(judge(을, 인, 무, 무).name).toBe("월겁격");
  });
  test("음간의 제왕 자리는 양인이 아님 — 기일간 사월은 정기 병 정인격", () => {
    // 사(巳) = 여기 무(겁재) · 중기 경(상관) · 정기 병(정인)
    expect(judge(기, 사, 임, 계).name).toBe("정인격");
    expect(judge(기, 사, 경, 계).name).toBe("상관격");
    expect(judge(기, 사, 무, 계).name).toBe("정인격"); // 겁재 투출은 격이 안 됨
  });
  test("무토 오월은 양인격, 기토 오월은 건록격 (화토동법)", () => {
    expect(judge(무, 오, 정, 정).name).toBe("양인격");
    expect(judge(기, 오, 정, 정).name).toBe("건록격");
  });
});

describe("子午卯酉월의 여기는 판정에 쓰지 않음 (午의 중기 己는 씀)", () => {
  test("갑일간 자월: 여기 임만 투출해도 정기 계 정인격", () => {
    const g = judge(갑, 자, 임, 병);
    expect(g.name).toBe("정인격");
    expect(g.rule).toBe("jeonggiDefault");
    expect(role(g, "여기").note).toContain("여기는 판정에 쓰지 않음");
  });
  test("경일간 유월은 건록이 아니라 양인 — 경일간 묘월: 여기 갑 투출해도 정기 을 정재격", () => {
    expect(judge(경, 묘, 갑, 계).name).toBe("정재격");
  });
  test("경일간 오월: 여기 병만 투출 → 정기 정 정관격", () => {
    const g = judge(경, 오, 병, 계);
    expect(g.name).toBe("정관격");
    expect(role(g, "여기").note).toContain("여기는 판정에 쓰지 않음");
  });
  test("경일간 오월: 중기 기 투출 → 정인격, 정기 정도 투출하면 정관격", () => {
    expect(judge(경, 오, 기, 기).name).toBe("정인격");
    expect(judge(경, 오, 정, 기).name).toBe("정관격");
  });
  test("癸生午月 丁己並透 → 정기 정 편재격, 己만 투출 → 편관격", () => {
    expect(judge(계, 오, 정, 기).name).toBe("편재격");
    expect(judge(계, 오, 기, 경).name).toBe("편관격");
  });
});

describe("申월의 중기 壬을 여기 戊가 극하면 본격(정기)", () => {
  // 신(申) = 여기 무 · 중기 임 · 정기 경
  test("乙生申月 透壬 → 정인격, 而又透戊 → 정관격 (格成正官)", () => {
    expect(judge(을, 申, 임, 계).name).toBe("정인격");
    const g = judge(을, 申, 임, 무);
    expect(g.name).toBe("정관격");
    expect(g.rule).toBe("mainKept");
    expect(role(g, "정기").chosen).toBe(true);
    expect(role(g, "중기").note).toContain("물러남");
  });
  test("丙生申月 逢壬 → 편관격, 而又透戊 → 편재격 (仍爲財格)", () => {
    expect(judge(병, 申, 임, 계).name).toBe("편관격");
    expect(judge(병, 申, 임, 무).name).toBe("편재격");
  });
  test("여기 戊만 투출하면 여기 격 (갑일간: 편재격)", () => {
    expect(judge(갑, 申, 무, 계).name).toBe("편재격");
  });
  test("정기 庚도 투출하면 정기가 먼저", () => {
    expect(judge(을, 申, 임, 무, 경).rule).toBe("jeonggiReveal");
  });
});

describe("辰戌丑未월의 戊·己 일간 (정기가 비겁)", () => {
  // 진(辰) = 여기 을 · 중기 계 · 정기 무
  test("무일간 진월: 계 투출 → 정재격, 을 투출 → 정관격, 둘 다 → 중기 계", () => {
    expect(judge(무, 진, 계, 경).name).toBe("정재격");
    expect(judge(무, 진, 을, 경).name).toBe("정관격");
    expect(judge(무, 진, 을, 계).name).toBe("정재격");
  });
  test("투출이 없으면 월겁격 — 정기 비겁이 투출해도 마찬가지", () => {
    expect(judge(무, 진, 경, 신).rule).toBe("gojiWolgeop");
    const g = judge(무, 진, 무, 신);
    expect(g.name).toBe("월겁격");
    expect(role(g, "정기").note).toContain("비겁");
  });
  test("기일간 진월(정기 무 = 겁재)도 같은 방식: 을 투출 → 편관격", () => {
    expect(judge(기, 진, 을, 경).name).toBe("편관격");
    expect(judge(기, 축, 경, 임).name).toBe("월겁격"); // 축 = 계·신·기, 투출 없음
  });
  test("甲生辰月: 透戊則用偏財，透癸則用正印，透乙則用月劫", () => {
    expect(judge(갑, 진, 경, 병).name).toBe("편재격"); // 투출 없음 → 정기
    expect(judge(갑, 진, 무, 병).name).toBe("편재격");
    expect(judge(갑, 진, 계, 병).name).toBe("정인격");
    const g = judge(갑, 진, 을, 병);
    expect(g.name).toBe("월겁격");
    expect(g.rule).toBe("hiddenReveal");
    expect(role(g, "여기").chosen).toBe(true);
  });
  test("잡기월에서 여러 개 투출하면 서열 (갑일간 진월: 을+무 → 편재격, 을+계 → 정인격)", () => {
    expect(judge(갑, 진, 을, 무).name).toBe("편재격");
    expect(judge(갑, 진, 을, 계).name).toBe("정인격");
  });
  test("중기 비겁도 잡기월이면 월겁 (임일간 진월, 계 투출)", () => {
    expect(judge(임, 진, 계, 경).name).toBe("월겁격");
  });
});

describe("삼합은 참고로만", () => {
  test("정일간 해월 + 묘·미 → 목국 성립을 알리지만 격은 그대로 (정기 임 정관격)", () => {
    const g = judge(정, 해, 경, 신, null, [묘, 해, 미]);
    expect(g.name).toBe("정관격");
    expect(g.samhap).toMatchObject({ element: "목", tenGodGroup: "인성" });
    expect(g.reasons.some((r) => r.includes("해묘미") && r.includes("반영하지 않습니다"))).toBe(true);
  });
  test("두 글자만 있으면 삼합 아님", () => {
    expect(judge(정, 해, 경, 신, null, [묘, 해]).samhap).toBeNull();
  });
  test("월지가 빠진 삼합은 무시", () => {
    expect(judge(정, 자, 경, 신, null, [해, 묘, 미, 자]).samhap).toBeNull();
  });
  test("국 오행의 십신 무리", () => {
    expect(judge(계, 인, 경, 신, null, [인, 오, 술]).samhap?.tenGodGroup).toBe("재성");
    expect(judge(갑, 申, 경, 신, null, [申, 자, 진]).samhap?.tenGodGroup).toBe("인성");
    expect(judge(갑, 유, 경, 신, null, [사, 유, 축]).samhap?.tenGodGroup).toBe("관성");
  });
});

describe("시간을 모를 때", () => {
  test("시간 투출에 따라 격이 달라지면 시지별 격을 보여 줌 (신일간 인월)", () => {
    // 신일간 시간: 자 무, 축 기, 인 경, 묘 신, 진 임, 사 계, 오 갑, 미 을, 신 병, 유 정, 술 무, 해 기
    const g = judge(신, 인, 경, 경, null);
    expect(g.name).toBe("정재격");
    const by = Object.fromEntries(g.byHourBranch!.map((x) => [x.name, x.hourBranches]));
    expect(by["정인격"]).toEqual([자, 술]);
    expect(by["정관격"]).toEqual([申]);
    expect(by["정재격"]).toHaveLength(9);
  });
  test("건록격처럼 시간과 무관하면 없음", () => {
    expect(judge(갑, 인, 경, 경, null).byHourBranch).toBeNull();
  });
});

describe("전수 검사 — 10 일간 × 12 월지 × 투출 조합", () => {
  const cases: GyeokInput[] = [];
  for (let d = 0; d < 10; d++)
    for (let m = 0; m < 12; m++)
      for (let y = 0; y < 10; y++)
        for (let mo = 0; mo < 10; mo++) cases.push({ dayStem: d, monthBranch: m, stems: { year: y, month: mo, hour: null }, branches: [m] });

  test("8격의 근거 천간은 언제나 월지 지장간이고 비견·겁재가 아님", () => {
    for (const c of cases) {
      const g = judgeGyeokguk(c);
      const chosen = g.hidden.filter((h) => h.chosen);
      if (["건록격", "양인격", "월겁격"].includes(g.name)) {
        if (g.rule === "hiddenReveal") {
          // 잡기월에서 투출한 비견·겁재를 월겁으로 쓴 경우
          expect(GOJI).toContain(c.monthBranch);
          expect(["비견", "겁재"]).toContain(chosen[0].tenGod);
        } else expect(chosen).toHaveLength(0);
        continue;
      }
      expect(chosen).toHaveLength(1);
      expect(BRANCHES[c.monthBranch].hidden.map(([s]) => s)).toContain(chosen[0].stem);
      expect(["비견", "겁재"]).not.toContain(chosen[0].tenGod);
      expect(g.name).toBe(`${chosen[0].tenGod}격`);
    }
  });
  test("子午卯酉의 여기는 격으로 고르지 않음", () => {
    for (const c of cases) {
      if (!WANGJI.includes(c.monthBranch)) continue;
      expect(judgeGyeokguk(c).hidden.find((h) => h.role === "여기")?.chosen ?? false).toBe(false);
    }
  });
  test("본격 유지(mainKept)는 申월 壬·戊에서만 일어남", () => {
    for (const c of cases) {
      const g = judgeGyeokguk(c);
      if (g.rule !== "mainKept") continue;
      expect(c.monthBranch).toBe(申);
      expect([c.stems.year, c.stems.month].sort()).toEqual([무, 임]);
    }
  });
  test("월령에서 정한 월겁·건록·양인은 월령이 일간과 같은 기운일 때만", () => {
    for (const c of cases) {
      const g = judgeGyeokguk(c);
      if (!["geonrok", "yangin", "wolgeop", "gojiWolgeop"].includes(g.rule)) continue;
      const main = BRANCHES[c.monthBranch].hidden.at(-1)![0];
      const sameQi = ["비견", "겁재"].includes(tenGod(c.dayStem, main)) || ROK_BRANCH[c.dayStem] === c.monthBranch || YANGIN_BRANCH[c.dayStem] === c.monthBranch;
      expect(sameQi).toBe(true);
    }
  });
  test("子卯酉월의 격은 투출과 무관 (午는 중기 己가 있어 제외)", () => {
    for (const m of [자, 묘, 유])
      for (let d = 0; d < 10; d++) {
        const names = new Set(cases.filter((c) => c.dayStem === d && c.monthBranch === m).map((c) => judgeGyeokguk(c).name));
        expect(names.size).toBe(1);
      }
  });
  test("규칙 표의 출처가 모두 있고, 사고는 辰戌丑未", () => {
    for (const r of GYEOK_RULES) for (const s of r.sources) expect(GYEOK_SOURCES[s]).toBeDefined();
    expect(GOJI.map((b) => BRANCHES[b].ko)).toEqual(["축", "진", "미", "술"]);
    expect(WANGJI.map((b) => BRANCHES[b].ko)).toEqual(["자", "묘", "오", "유"]);
  });
});

describe("『子平眞詮』 원문 예시", () => {
  test.each([
    ["辛生寅月 透丙 → 정관 (論用神變化)", 신, 인, [병], "정관격"],
    ["壬生戌月 逢辛 → 정인", 임, 술, [신], "정인격"],
    ["己生申月 藏庚透壬 → 정재", 기, 申, [임], "정재격"],
    ["辛生寅月 透丙 而又透甲 → 정재 (格成正財)", 신, 인, [병, 갑], "정재격"],
    ["癸生寅月 透丙 而又透甲 → 상관 (格成傷官)", 계, 인, [병, 갑], "상관격"],
    ["乙生申月 透壬 而又透戊 → 정관 (格成正官)", 을, 申, [임, 무], "정관격"],
    ["丙生申月 逢壬 而又透戊 → 편재 (仍爲財格)", 병, 申, [임, 무], "편재격"],
    ["丙生寅月 甲不透 → 편인 (本爲印綬)", 병, 인, [], "편인격"],
    ["丁生亥月 → 정관 (本爲正官)", 정, 해, [], "정관격"],
    ["乙生寅月 透戊 → 월겁 (論用神變化)", 을, 인, [무], "월겁격"],
    ["甲生辰月 透戊 → 편재 (論雜氣如何取用)", 갑, 진, [무], "편재격"],
    ["甲生辰月 透癸 → 정인", 갑, 진, [계], "정인격"],
    ["甲生辰月 透乙 → 월겁", 갑, 진, [을], "월겁격"],
    ["甲生丑月 透辛 → 정관", 갑, 축, [신], "정관격"],
    ["丙生辰月 透癸 而又透乙 → 정관 (官與印相生)", 병, 진, [계, 을], "정관격"],
    ["壬生未月 透己 → 정관", 임, 미, [기], "정관격"],
    ["丙生午月 → 양인 (論陽刃)", 병, 오, [], "양인격"],
    ["戊生午月 → 양인 (論陽刃)", 무, 오, [], "양인격"],
    ["木生寅卯 — 甲寅 건록", 갑, 인, [], "건록격"],
    ["木生寅卯 — 甲卯 양인", 갑, 묘, [], "양인격"],
    ["木生寅卯 — 乙卯 건록", 을, 묘, [], "건록격"],
    ["木生寅卯 — 乙寅 월겁", 을, 인, [], "월겁격"],
  ] as const)("%s", (_, d, m, revealed, name) => {
    // 투출하지 않은 자리에는 월지 지장간에 없는 천간을 넣는다
    const filler = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((s) => !BRANCHES[m].hidden.some(([h]) => h === s))!;
    const [y, mo] = [revealed[0] ?? filler, revealed[1] ?? filler];
    expect(judge(d, m, y, mo).name).toBe(name);
  });
});

describe("computeSaju 결과에 격국 포함", () => {
  const base: Omit<SajuInput, "year" | "month" | "day" | "time"> = {
    calendar: "solar", gender: "M", longitude: 126.978, correction: "longitude", dayBoundary: "23",
  };
  const at = (date: string, time: string | null) => {
    const [year, month, day] = date.split("-").map(Number);
    const t = time ? { hour: Number(time.slice(0, 2)), minute: Number(time.slice(3, 5)) } : null;
    return computeSaju({ ...base, year, month, day, time: t }, new Date("2026-10-19T03:00:00Z"));
  };
  test("2024-03-01 12:00 갑진 병인 갑자 경오 → 건록격", () => {
    const r = at("2024-03-01", "12:00");
    expect([r.pillars.year.ko, r.pillars.month.ko, r.pillars.day.ko, r.pillars.hour!.ko]).toEqual(["갑진", "병인", "갑자", "경오"]);
    expect(r.gyeokguk.name).toBe("건록격");
  });
  test("2024-03-02 12:00 갑진 병인 을축 임오 → 월겁격 (갑·병 투출과 무관)", () => {
    const r = at("2024-03-02", "12:00");
    expect(r.pillars.day.ko).toBe("을축");
    expect(r.gyeokguk.name).toBe("월겁격");
  });
  test("2024-02-07 12:00 갑진 병인 신축 갑오 → 정재격 (정기 갑 연간·시간, 중기 병 월간)", () => {
    const r = at("2024-02-07", "12:00");
    expect([r.pillars.year.ko, r.pillars.month.ko, r.pillars.day.ko, r.pillars.hour!.ko]).toEqual(["갑진", "병인", "신축", "갑오"]);
    expect(r.gyeokguk.name).toBe("정재격");
    expect(r.gyeokguk.hidden.map((h) => [h.role, h.revealedAt])).toEqual([["여기", []], ["중기", ["month"]], ["정기", ["year", "hour"]]]);
  });
  test("시간 모름이면 시간 없이 판정", () => {
    const r = at("2024-02-07", null);
    expect(r.gyeokguk.name).toBe("정재격");
    expect(r.gyeokguk.byHourBranch).toBeNull(); // 정기가 이미 연간에 투출
  });
});
