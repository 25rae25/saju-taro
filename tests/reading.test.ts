/**
 * 사주 풀이 문장 — 모든 조건에 문장이 있는지, 선택 규칙의 경계, 결정성(같은 입력 → 같은 결과).
 */
import { afterEach, describe, expect, test, vi } from "vitest";
import { DAY_STEM_READINGS } from "@/data/saju/day-stems";
import { ELEMENT_COMMON, ELEMENT_READINGS } from "@/data/saju/elements";
import { GYEOK_COMMON, GYEOK_READINGS } from "@/data/saju/gyeokguk";
import { LUCK_COMMON, READING_DISCLAIMER } from "@/data/saju/reading-common";
import { LUCK_TEN_GOD_READINGS, NATAL_TEN_GOD_COMMON, NATAL_TEN_GOD_READINGS } from "@/data/saju/ten-gods";
import { TWELVE_STAGE_READINGS } from "@/data/saju/twelve-stages";
import { computeSaju, type SajuInput, type SajuResult } from "@/lib/saju";
import { ELEMENTS, STEMS, TWELVE_STAGES, type TenGod } from "@/lib/saju/constants";
import { GYEOK_INFO, type GyeokName } from "@/lib/saju/gyeokguk";
import {
  READING_RULES, TEN_GODS, buildSajuReading, currentDaeunIndex, elementLevel, natalTenGodCounts, prominentTenGods, seunAt,
} from "@/lib/saju/reading";
import { termsOfYear } from "@/lib/saju/terms";

const SEOUL = 126.978;
const NOW = Date.parse("2026-10-19T03:00:00Z");
const GYEOK_NAMES = Object.keys(GYEOK_INFO) as GyeokName[];

function saju(date: string, time: string | null, opts: Partial<SajuInput> = {}) {
  const [y, m, d] = date.split("-").map(Number);
  const t = time ? { hour: Number(time.slice(0, 2)), minute: Number(time.slice(3, 5)) } : null;
  return computeSaju(
    { calendar: "solar", year: y, month: m, day: d, time: t, gender: "M", longitude: SEOUL, correction: "longitude", dayBoundary: "23", ...opts },
    new Date(NOW),
  );
}
const rulesOf = (r: SajuResult, now = NOW) => buildSajuReading(r, now).sections.flatMap((s) => s.paragraphs.map((p) => p.rule));
const section = (r: SajuResult, id: string, now = NOW) => buildSajuReading(r, now).sections.find((s) => s.id === id)!;

// ── 문장 데이터 ──────────────────────────────────────────

/** 모든 문장 (템플릿은 예시 값으로 채움) */
const ALL_TEXTS: [string, string][] = [
  ...DAY_STEM_READINGS.map((d, i): [string, string] => [`일간 ${STEMS[i].ko}`, `${d.image}에 비유해요. ${d.text}`]),
  ...ELEMENTS.flatMap((e): [string, string][] => [[`오행 ${e} 많음`, ELEMENT_READINGS[e].excess], [`오행 ${e} 없음`, ELEMENT_READINGS[e].lacking]]),
  ...Object.entries(ELEMENT_COMMON).map(([k, v]): [string, string] => [`오행 공통 ${k}`, v]),
  ...TEN_GODS.map((t): [string, string] => [`원국 십신 ${t}`, NATAL_TEN_GOD_READINGS[t]]),
  ...Object.entries(NATAL_TEN_GOD_COMMON).map(([k, v]): [string, string] => [`십신 공통 ${k}`, v]),
  ...TEN_GODS.map((t): [string, string] => [`운 십신 ${t}`, LUCK_TEN_GOD_READINGS[t]]),
  ...TWELVE_STAGES.map((s): [string, string] => [`12운성 ${s}`, TWELVE_STAGE_READINGS[s]]),
  ...GYEOK_NAMES.map((g): [string, string] => [`격국 ${g}`, GYEOK_READINGS[g]]),
  ["격국 시간 모름", GYEOK_COMMON.byHourBranch("정관격·편재격")],
  ["격국 삼합", GYEOK_COMMON.samhap("신자진 수국(水局)")],
  ["대운 전", LUCK_COMMON.daeunBefore(3, "정축", "2029.04")],
  ["대운 지금", LUCK_COMMON.daeunCurrent(23, "임신", "壬申", "2019.04", "2029.04")],
  ["세운", LUCK_COMMON.seunCurrent(2026, "병오", "丙午", "2026년 2월 4일")],
  ["안내", READING_DISCLAIMER],
];

/** 단정·운명론 표현, 의료·재정 조언에 쓰이는 말 */
const BANNED = [
  "반드시", "절대", "틀림없", "무조건", "운명", "숙명", "팔자가", "흉", "재앙", "망하", "죽", "사망", "단명",
  "질병", "병원", "치료", "수술", "약을", "건강이 나빠", "투자", "주식", "코인", "대출", "부동산", "돈을 번", "부자",
  "이혼", "사고가",
];

describe("문장 데이터 — 모든 조건에 문장이 있다", () => {
  test("일간 10개", () => {
    expect(DAY_STEM_READINGS).toHaveLength(10);
    for (const d of DAY_STEM_READINGS) expect(d.image.length * d.text.length).toBeGreaterThan(0);
  });
  test("오행 5 × (많음·없음)", () => {
    expect(Object.keys(ELEMENT_READINGS).sort()).toEqual([...ELEMENTS].sort());
    for (const e of ELEMENTS) {
      expect(ELEMENT_READINGS[e].excess).not.toBe("");
      expect(ELEMENT_READINGS[e].lacking).not.toBe("");
    }
  });
  test("십신 10개 — 원국 분포·대운세운", () => {
    expect(Object.keys(NATAL_TEN_GOD_READINGS).sort()).toEqual([...TEN_GODS].sort());
    expect(Object.keys(LUCK_TEN_GOD_READINGS).sort()).toEqual([...TEN_GODS].sort());
  });
  test("12운성 12개", () => {
    expect(Object.keys(TWELVE_STAGE_READINGS).sort()).toEqual([...TWELVE_STAGES].sort());
  });
  test("격국: 판정할 수 있는 격 이름마다", () => {
    expect(GYEOK_NAMES).toHaveLength(11);
    expect(Object.keys(GYEOK_READINGS).sort()).toEqual([...GYEOK_NAMES].sort());
  });

  test.each(ALL_TEXTS)("%s — 해요체, 금지 표현 없음", (_, text) => {
    expect(text.trim()).toBe(text);
    // 문장마다 '요.'로 끝난다
    for (const sentence of text.split(/(?<=\.)\s+/)) expect(sentence).toMatch(/요\.$/);
    for (const w of BANNED) expect(text).not.toContain(w);
  });

  test("문장이 서로 겹치지 않는다", () => {
    const texts = ALL_TEXTS.map(([, t]) => t);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

// ── 선택 규칙의 경계 ─────────────────────────────────────

describe("오행 많음·없음 기준", () => {
  test.each([
    [0, "lacking"], [1, "normal"], [2, "normal"], [3, "normal"], [4, "excess"], [8, "excess"],
  ] as const)("%i글자 → %s", (n, level) => expect(elementLevel(n)).toBe(level));
  test("기준값은 8글자의 절반", () => expect(READING_RULES.elementExcessMin).toBe(4));
});

describe("가장 많은 십신", () => {
  const counts = (c: Partial<Record<TenGod, number>>) =>
    Object.fromEntries(TEN_GODS.map((t) => [t, c[t] ?? 0])) as Record<TenGod, number>;
  test("모두 1자리 이하면 '고르게' (빈 배열)", () => {
    expect(prominentTenGods(counts({ 비견: 1, 식신: 1, 정재: 1, 정관: 1, 정인: 1 }))).toEqual([]);
    expect(prominentTenGods(counts({}))).toEqual([]);
  });
  test("2자리가 하나면 그것만", () => {
    expect(prominentTenGods(counts({ 편재: 2, 정관: 1, 비견: 1 }))).toEqual(["편재"]);
  });
  test("동률이면 모두, 십신 순서(비견→정인)대로", () => {
    expect(prominentTenGods(counts({ 정인: 2, 비견: 2, 상관: 1 }))).toEqual(["비견", "정인"]);
  });
  test("최댓값만 고른다", () => {
    expect(prominentTenGods(counts({ 정관: 3, 편재: 2, 비견: 2 }))).toEqual(["정관"]);
  });
});

describe("지금의 대운 경계", () => {
  const r = saju("1990-05-15", "10:30");
  const items = r.daeun.items;
  test("첫 대운 시작 1ms 전이면 대운 전", () => {
    expect(currentDaeunIndex(r.daeun, items[0].startUtcMs - 1)).toBe(-1);
    expect(section(r, "daeun", items[0].startUtcMs - 1).paragraphs.map((p) => p.rule)).toEqual(["daeun.before"]);
  });
  test("시작 순간부터 그 대운", () => {
    for (let k = 0; k < 10; k++) {
      expect(currentDaeunIndex(r.daeun, items[k].startUtcMs)).toBe(k);
      if (k > 0) expect(currentDaeunIndex(r.daeun, items[k].startUtcMs - 1)).toBe(k - 1);
    }
  });
  test("마지막 대운 뒤에도 마지막 대운", () => {
    expect(currentDaeunIndex(r.daeun, items[9].startUtcMs + 50 * 365 * 86400e3)).toBe(9);
  });
  test("화면 표의 현재 대운 판정과 같다", () => {
    for (const now of [items[0].startUtcMs - 1, items[3].startUtcMs, items[3].startUtcMs + 1, NOW]) {
      const view = items.findIndex((d, i) => now >= d.startUtcMs && (i === 9 || now < items[i + 1].startUtcMs));
      expect(currentDaeunIndex(r.daeun, now)).toBe(view);
    }
  });
  test("대운 문단: 머리 문장 → 천간·지지 십신 → 12운성", () => {
    const s = section(r, "daeun");
    const d = items[currentDaeunIndex(r.daeun, NOW)];
    expect(s.paragraphs[0].rule).toBe("daeun.current");
    expect(s.paragraphs[0].text).toContain(`${d.label}세 대운 ${d.ko}(${d.hanja})`);
    expect(s.paragraphs.at(-1)!.rule).toBe(`stage.${d.twelveStage}`);
    expect(s.paragraphs.some((p) => p.rule === `luck.${d.stemTenGod}`)).toBe(true);
    expect(s.paragraphs.some((p) => p.rule === `luck.${d.branchTenGod}`)).toBe(true);
  });
});

describe("올해 세운 — 입춘 순간에 바뀐다", () => {
  const ipchun2027 = termsOfYear(2027).find((t) => t.name === "입춘")!.utcMs; // 2027-02-04 10:46 KST
  test("입춘 1ms 전은 병오년, 입춘 순간부터 정미년", () => {
    const before = seunAt(ipchun2027 - 1)!;
    const after = seunAt(ipchun2027)!;
    expect([before.year, before.pillar.stem, before.pillar.branch]).toEqual([2026, 2, 6]); // 병오
    expect([after.year, after.pillar.stem, after.pillar.branch]).toEqual([2027, 3, 7]); // 정미
  });
  test("양력 새해가 됐어도 입춘 전이면 전년도 세운", () => {
    const r = saju("2000-01-01", "12:00");
    const s = section(r, "seun", Date.parse("2027-01-15T03:00:00Z"));
    expect(s.paragraphs[0].text).toContain("2026년 병오(丙午)년");
    expect(s.paragraphs[0].text).toContain("2026년 2월 4일 입춘");
  });
  test("절기 데이터 범위 밖이면 세운 섹션 없음", () => {
    expect(seunAt(Date.parse("2200-01-01T00:00:00Z"))).toBeNull();
    const ids = buildSajuReading(saju("2000-01-01", "12:00"), Date.parse("2200-01-01T00:00:00Z")).sections.map((s) => s.id);
    expect(ids).not.toContain("seun");
  });
  test("천간·지지 십신이 같으면 한 문단으로", () => {
    // 경(庚) 일간 + 2034 갑인년: 갑=편재, 인 정기 갑=편재
    const r = saju("1990-01-15", "12:00"); // 기사년 정축월 경진일
    expect(STEMS[r.pillars.day.pillar.stem].ko).toBe("경");
    const s = section(r, "seun", Date.parse("2034-06-01T00:00:00Z"));
    expect(s.paragraphs.map((p) => p.rule)).toEqual(["seun.current", "luck.편재", "stage.절"]);
    expect(s.paragraphs[1].label).toBe("천간·지지 편재(偏財)");
  });
});

describe("명식 예시 — 2000-01-01 12:00 서울 (기묘 병자 무오 무오)", () => {
  const r = saju("2000-01-01", "12:00");
  const reading = buildSajuReading(r, NOW);
  test("섹션은 상담 흐름 순서", () => {
    expect(reading.sections.map((s) => s.id)).toEqual(["gyeokguk", "daeun", "seun", "dayStem", "elements", "tenGods"]);
    expect(reading.disclaimer).toBe(READING_DISCLAIMER);
  });
  test("격국: 자월 정기 계 = 무토의 정재 → 정재격", () => {
    expect(section(r, "gyeokguk").paragraphs.map((p) => p.rule)).toEqual(["gyeok.정재격"]);
  });
  test("일간: 무토, 일지 오는 제왕", () => {
    expect(section(r, "dayStem").paragraphs.map((p) => p.rule)).toEqual(["dayStem.무", "dayStage.제왕"]);
    expect(section(r, "dayStem").paragraphs[0].label).toBe("무토(戊土)");
  });
  test("오행 목1 화3 토3 금0 수1: 많음 없음, 금 없음(무토 기준 식상)", () => {
    const s = section(r, "elements");
    expect(s.paragraphs.map((p) => p.rule)).toEqual(["element.lacking.금", "element.lackingLuck"]);
    expect(s.paragraphs[0].label).toBe("금(金) 0개 · 없음 · 일간 기준 식상");
  });
  test("십신: 겁재·편인·비견 / 정관·정재·정인·정인 → 정인 2자리", () => {
    expect(natalTenGodCounts(r.pillars)).toMatchObject({ 정인: 2, 겁재: 1, 편인: 1, 비견: 1, 정관: 1, 정재: 1 });
    expect(section(r, "tenGods").paragraphs.map((p) => p.rule)).toEqual(["tenGod.prominent.정인"]);
  });
  test("2026 병오년 세운: 병=편인, 오 정기 정=정인, 무-오 제왕", () => {
    expect(section(r, "seun").paragraphs.map((p) => p.rule)).toEqual(["seun.current", "luck.편인", "luck.정인", "stage.제왕"]);
  });
});

describe("시간 모름", () => {
  const r = saju("2000-01-01", null);
  test("십신은 5자리만 센다", () => {
    expect(Object.values(natalTenGodCounts(r.pillars)).reduce((a, b) => a + b, 0)).toBe(5);
    expect(section(r, "tenGods").basis).toContain(NATAL_TEN_GOD_COMMON.hourUnknown);
  });
  test("없는 오행에는 시주에 있을 수 있다는 안내", () => {
    const rules = section(r, "elements").paragraphs.map((p) => p.rule);
    expect(rules.some((x) => x.startsWith("element.lacking."))).toBe(true);
    expect(rules.at(-1)).toBe("element.hourUnknown");
  });
});

// ── 결정성 ───────────────────────────────────────────────

describe("결정성 — 같은 입력이면 같은 결과", () => {
  afterEach(() => vi.useRealTimers());
  test("두 번 계산해도, 시스템 시각이 달라도 같다", () => {
    const r = saju("1987-07-01", "10:20");
    const a = JSON.stringify(buildSajuReading(r, NOW));
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2041-03-03T00:00:00Z"));
    expect(JSON.stringify(buildSajuReading(r, NOW))).toBe(a);
    expect(JSON.stringify(buildSajuReading(structuredClone(r), NOW))).toBe(a);
  });
  test("결과 객체를 바꾸지 않는다", () => {
    const r = saju("1987-07-01", "10:20");
    const before = JSON.stringify(r);
    buildSajuReading(r, NOW);
    expect(JSON.stringify(r)).toBe(before);
  });
});

// ── 모든 규칙에 실제로 도달하는지 ────────────────────────

describe("명식 3,000여 개 — 모든 규칙이 실제로 쓰이고, 문단은 빈 곳이 없다", () => {
  const seen = new Set<string>();
  const problems: string[] = [];
  const DAY = 86400e3;
  let n = 0;
  for (let t = Date.parse("1931-01-01T00:00:00Z"), k = 0; t < Date.parse("2026-10-01T00:00:00Z"); t += 11 * DAY, k++) {
    const date = new Date(t).toISOString().slice(0, 10);
    const time = k % 5 === 0 ? null : `${String((k * 7) % 24).padStart(2, "0")}:${String((k * 13) % 60).padStart(2, "0")}`;
    const r = saju(date, time, { gender: k % 2 ? "M" : "F" });
    const reading = buildSajuReading(r, NOW);
    for (const s of reading.sections) {
      if (s.paragraphs.length === 0 || s.paragraphs.some((p) => p.text === "")) problems.push(`${date} ${time}: ${s.id} 빈 문단`);
    }
    // 오행 규칙이 글자 수와 맞는지
    const rules = rulesOf(r);
    for (const e of ELEMENTS) {
      if (rules.includes(`element.excess.${e}`) !== r.elements[e] >= READING_RULES.elementExcessMin) problems.push(`${date} ${time}: ${e} 많음`);
      if (rules.includes(`element.lacking.${e}`) !== (r.elements[e] === 0)) problems.push(`${date} ${time}: ${e} 없음`);
    }
    for (const x of rules) seen.add(x);
    n++;
  }

  test("빈 문단·규칙 불일치 없음", () => expect(problems).toEqual([]));
  test("표본 수", () => expect(n).toBeGreaterThan(3000));

  const expected = [
    ...STEMS.map((s) => `dayStem.${s.ko}`),
    ...TWELVE_STAGES.flatMap((s) => [`dayStage.${s}`, `stage.${s}`]),
    ...ELEMENTS.flatMap((e) => [`element.excess.${e}`, `element.lacking.${e}`]),
    "element.balanced", "element.lackingLuck", "element.hourUnknown",
    ...TEN_GODS.flatMap((t) => [`tenGod.prominent.${t}`, `luck.${t}`]),
    "tenGod.even",
    ...GYEOK_NAMES.map((g) => `gyeok.${g}`),
    "gyeok.byHourBranch", "gyeok.samhap",
    "daeun.before", "daeun.current", "seun.current",
  ];
  test.each(expected)("%s", (rule) => expect(seen.has(rule)).toBe(true));
  test("예상하지 않은 규칙 id가 없다", () => {
    expect([...seen].filter((x) => !expected.includes(x))).toEqual([]);
  });
});
