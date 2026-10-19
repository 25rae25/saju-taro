/**
 * 규칙 기반 사주 풀이 — computeSaju 결과로 src/data/saju/의 문장을 고른다.
 *
 * - 순수 함수: 같은 (결과, 시각)이면 항상 같은 풀이. 현재 시각은 인자로만 받고, 무작위 선택은 없다.
 * - 순서는 상담 흐름: 격국 → 지금의 대운 → 올해 세운 → 일간 → 오행 → 십신 분포.
 * - 각 문단의 rule은 docs/DATA.md "사주 풀이 문장" 표의 규칙 id다.
 */
import { DAY_STEM_READINGS } from "@/data/saju/day-stems";
import { ELEMENT_COMMON, ELEMENT_READINGS } from "@/data/saju/elements";
import { GYEOK_COMMON, GYEOK_READINGS } from "@/data/saju/gyeokguk";
import { LUCK_COMMON, READING_DISCLAIMER } from "@/data/saju/reading-common";
import {
  LUCK_TEN_GOD_READINGS, NATAL_TEN_GOD_COMMON, NATAL_TEN_GOD_READINGS, TEN_GOD_HANJA,
} from "@/data/saju/ten-gods";
import { TWELVE_STAGE_HANJA, TWELVE_STAGE_READINGS } from "@/data/saju/twelve-stages";
import {
  BRANCHES, ELEMENT_HANJA, ELEMENTS, STEMS, mainHiddenStem, pillarHanja, pillarKo, sexagenary, tenGod, twelveStage,
  type Element, type Pillar, type TenGod, type TwelveStage,
} from "./constants";
import type { SajuResult } from "./index";
import { ipchunAtOrBefore } from "./terms";
import { seoulOffsetAt } from "./time";

/** 선택 규칙의 기준값 */
export const READING_RULES = {
  /** 오행 글자 수가 이 값 이상이면 '많음' (8글자의 절반) */
  elementExcessMin: 4,
  /** 가장 많은 십신이 이 자리 수 이상일 때만 '가장 많음'으로 풀이 (아니면 '고르게') */
  tenGodProminentMin: 2,
} as const;

export const TEN_GODS: readonly TenGod[] = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];

/** 일간 오행에서 본 거리(0 같음, 1 내가 생함, 2 내가 극함, 3 나를 극함, 4 나를 생함) → 십신 무리 */
const TEN_GOD_GROUP = ["비겁", "식상", "재성", "관성", "인성"] as const;
export type TenGodGroup = (typeof TEN_GOD_GROUP)[number];

export type ReadingSectionId = "gyeokguk" | "daeun" | "seun" | "dayStem" | "elements" | "tenGods";

export interface ReadingParagraph {
  /** 문단 머리 (없으면 null) */
  label: string | null;
  text: string;
  /** 문장을 고른 규칙 id */
  rule: string;
}

export interface ReadingSection {
  id: ReadingSectionId;
  title: string;
  /** 무엇을 근거로 골랐는지 */
  basis: string;
  paragraphs: ReadingParagraph[];
}

export interface SajuReading {
  disclaimer: string;
  sections: ReadingSection[];
}

/** 대운·세운 한 기둥에서 풀이에 쓰는 값 */
interface LuckPillar {
  stemTenGod: TenGod;
  branchTenGod: TenGod;
  twelveStage: TwelveStage;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** UTC 순간 → 서울 시계의 연.월 (대운 표의 표기와 같음) */
function yearMonth(utcMs: number) {
  const d = new Date(utcMs + 9 * 3600e3);
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}`;
}

/** UTC 순간 → 서울 시계의 'YYYY년 M월 D일' */
function koreanDate(utcMs: number) {
  const d = new Date(utcMs + seoulOffsetAt(utcMs).offsetMin * 60000);
  return `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}

export function elementGroup(dayStem: number, e: Element): TenGodGroup {
  return TEN_GOD_GROUP[(ELEMENTS.indexOf(e) - Math.floor(dayStem / 2) + 5) % 5];
}

/** 지금(nowMs) 해당하는 대운 순번(0~9). 첫 대운 전이면 -1, 마지막 대운 뒤에도 9 */
export function currentDaeunIndex(daeun: SajuResult["daeun"], nowMs: number): number {
  const items = daeun.items;
  for (let i = items.length - 1; i >= 0; i--) if (nowMs >= items[i].startUtcMs) return i;
  return -1;
}

/** 지금(nowMs)의 세운 — 해의 간지는 입춘 순간에 바뀐다. 절기 데이터 범위 밖이면 null */
export function seunAt(nowMs: number): { year: number; pillar: Pillar; ipchunUtcMs: number } | null {
  let ipchunUtcMs: number;
  try {
    ipchunUtcMs = ipchunAtOrBefore(nowMs).utcMs;
  } catch (e) {
    if (e instanceof RangeError) return null;
    throw e;
  }
  const year = new Date(ipchunUtcMs).getUTCFullYear();
  return { year, pillar: sexagenary(year - 4), ipchunUtcMs };
}

/** 원국 십신 자리 수 — 천간은 일간을 뺀 연·월·시간, 지지는 정기 기준 연·월·일·시지 */
export function natalTenGodCounts(pillars: SajuResult["pillars"]): Record<TenGod, number> {
  const counts = Object.fromEntries(TEN_GODS.map((t) => [t, 0])) as Record<TenGod, number>;
  for (const p of [pillars.year, pillars.month, pillars.day, pillars.hour]) {
    if (!p) continue;
    if (p.stemTenGod) counts[p.stemTenGod]++;
    counts[p.branchTenGod]++;
  }
  return counts;
}

/** 가장 많은 십신(동률이면 모두, 십신 순서대로). 최댓값이 기준 미만이면 빈 배열 */
export function prominentTenGods(counts: Record<TenGod, number>): TenGod[] {
  const max = Math.max(...TEN_GODS.map((t) => counts[t]));
  if (max < READING_RULES.tenGodProminentMin) return [];
  return TEN_GODS.filter((t) => counts[t] === max);
}

/** 오행별 판정 — 많음(기준 이상)·없음(0)·보통 */
export function elementLevel(count: number): "excess" | "lacking" | "normal" {
  if (count >= READING_RULES.elementExcessMin) return "excess";
  if (count === 0) return "lacking";
  return "normal";
}

const tenGodLabel = (t: TenGod) => `${t}(${TEN_GOD_HANJA[t]})`;
const stageLabel = (s: TwelveStage) => `${s}(${TWELVE_STAGE_HANJA[s]})`;

function luckParagraphs(p: LuckPillar): ReadingParagraph[] {
  const out: ReadingParagraph[] =
    p.stemTenGod === p.branchTenGod
      ? [{ label: `천간·지지 ${tenGodLabel(p.stemTenGod)}`, text: LUCK_TEN_GOD_READINGS[p.stemTenGod], rule: `luck.${p.stemTenGod}` }]
      : [
          { label: `천간 ${tenGodLabel(p.stemTenGod)}`, text: LUCK_TEN_GOD_READINGS[p.stemTenGod], rule: `luck.${p.stemTenGod}` },
          { label: `지지 ${tenGodLabel(p.branchTenGod)}`, text: LUCK_TEN_GOD_READINGS[p.branchTenGod], rule: `luck.${p.branchTenGod}` },
        ];
  out.push({ label: `12운성 ${stageLabel(p.twelveStage)}`, text: TWELVE_STAGE_READINGS[p.twelveStage], rule: `stage.${p.twelveStage}` });
  return out;
}

function gyeokSection(r: SajuResult): ReadingSection {
  const g = r.gyeokguk;
  const paragraphs: ReadingParagraph[] = [
    { label: `${g.name}(${g.hanja})`, text: GYEOK_READINGS[g.name], rule: `gyeok.${g.name}` },
  ];
  if (g.byHourBranch) {
    const others = g.byHourBranch.map((x) => x.name).filter((n) => n !== g.name);
    paragraphs.push({ label: "시간 모름", text: GYEOK_COMMON.byHourBranch(others.join("·")), rule: "gyeok.byHourBranch" });
  }
  if (g.samhap) {
    paragraphs.push({ label: "삼합", text: GYEOK_COMMON.samhap(g.samhap.name), rule: "gyeok.samhap" });
  }
  return { id: "gyeokguk", title: "격국", basis: "자평진전식 내격 판정 결과 · 유파에 따라 다르게 볼 수 있어요", paragraphs };
}

function daeunSection(r: SajuResult, nowMs: number): ReadingSection {
  const items = r.daeun.items;
  const i = currentDaeunIndex(r.daeun, nowMs);
  if (i < 0) {
    const first = items[0];
    return {
      id: "daeun",
      title: "지금의 대운",
      basis: `대운수 ${r.daeun.number} · ${r.daeun.forward ? "순행" : "역행"}`,
      paragraphs: [{ label: null, text: LUCK_COMMON.daeunBefore(first.label, first.ko, yearMonth(first.startUtcMs)), rule: "daeun.before" }],
    };
  }
  const d = items[i];
  const span = items[1].startUtcMs - items[0].startUtcMs; // 10년
  const endMs = i + 1 < items.length ? items[i + 1].startUtcMs : d.startUtcMs + span;
  return {
    id: "daeun",
    title: "지금의 대운",
    basis: `${d.label}세 대운 ${d.ko} · 천간·지지 십신과 12운성`,
    paragraphs: [
      { label: null, text: LUCK_COMMON.daeunCurrent(d.label, d.ko, d.hanja, yearMonth(d.startUtcMs), yearMonth(endMs)), rule: "daeun.current" },
      ...luckParagraphs({ stemTenGod: d.stemTenGod!, branchTenGod: d.branchTenGod, twelveStage: d.twelveStage }),
    ],
  };
}

function seunSection(r: SajuResult, nowMs: number): ReadingSection | null {
  const s = seunAt(nowMs);
  if (!s) return null;
  const dayStem = r.pillars.day.pillar.stem;
  const ko = pillarKo(s.pillar);
  return {
    id: "seun",
    title: "올해 세운",
    basis: `입춘 기준 ${s.year}년 ${ko}년 · 천간·지지 십신과 12운성`,
    paragraphs: [
      { label: null, text: LUCK_COMMON.seunCurrent(s.year, ko, pillarHanja(s.pillar), koreanDate(s.ipchunUtcMs)), rule: "seun.current" },
      ...luckParagraphs({
        stemTenGod: tenGod(dayStem, s.pillar.stem),
        branchTenGod: tenGod(dayStem, mainHiddenStem(s.pillar.branch)),
        twelveStage: twelveStage(dayStem, s.pillar.branch),
      }),
    ],
  };
}

function dayStemSection(r: SajuResult): ReadingSection {
  const day = r.pillars.day;
  const stem = STEMS[day.pillar.stem];
  const branch = BRANCHES[day.pillar.branch];
  const reading = DAY_STEM_READINGS[stem.index];
  return {
    id: "dayStem",
    title: "일간 성향",
    basis: `일간 ${stem.ko}${stem.element} · 일지 12운성(일간이 일지에서 어떤 단계인지)`,
    paragraphs: [
      {
        label: `${stem.ko}${stem.element}(${stem.hanja}${ELEMENT_HANJA[stem.element]})`,
        text: `${reading.image}에 비유해요. ${reading.text}`,
        rule: `dayStem.${stem.ko}`,
      },
      {
        label: `일지 ${branch.ko}(${branch.hanja}) · 12운성 ${stageLabel(day.twelveStage)}`,
        text: TWELVE_STAGE_READINGS[day.twelveStage],
        rule: `dayStage.${day.twelveStage}`,
      },
    ],
  };
}

function elementSection(r: SajuResult): ReadingSection {
  const dayStem = r.pillars.day.pillar.stem;
  const total = ELEMENTS.reduce((a, e) => a + r.elements[e], 0);
  const paragraphs: ReadingParagraph[] = [];
  const head = (e: Element, word: string) =>
    `${e}(${ELEMENT_HANJA[e]}) ${r.elements[e]}개 · ${word} · 일간 기준 ${elementGroup(dayStem, e)}`;
  for (const e of ELEMENTS) {
    if (elementLevel(r.elements[e]) === "excess") {
      paragraphs.push({ label: head(e, "많음"), text: ELEMENT_READINGS[e].excess, rule: `element.excess.${e}` });
    }
  }
  const lacking = ELEMENTS.filter((e) => elementLevel(r.elements[e]) === "lacking");
  for (const e of lacking) {
    paragraphs.push({ label: head(e, "없음"), text: ELEMENT_READINGS[e].lacking, rule: `element.lacking.${e}` });
  }
  if (lacking.length) {
    paragraphs.push({ label: null, text: ELEMENT_COMMON.lackingLuck, rule: "element.lackingLuck" });
    if (!r.timeKnown) paragraphs.push({ label: null, text: ELEMENT_COMMON.hourUnknown, rule: "element.hourUnknown" });
  }
  if (paragraphs.length === 0) paragraphs.push({ label: null, text: ELEMENT_COMMON.balanced, rule: "element.balanced" });
  return {
    id: "elements",
    title: "오행의 많고 적음",
    basis: `천간·지지 ${total}글자 기준 · ${READING_RULES.elementExcessMin}개 이상이면 많음, 0개면 없음`,
    paragraphs,
  };
}

function tenGodSection(r: SajuResult): ReadingSection {
  const counts = natalTenGodCounts(r.pillars);
  const top = prominentTenGods(counts);
  const slots = r.timeKnown ? "천간 3자리(일간 제외)·지지 4자리" : "천간 2자리(일간 제외)·지지 3자리";
  return {
    id: "tenGods",
    title: "십신 분포",
    basis: `${slots} · 지지는 정기 기준${r.timeKnown ? "" : ` · ${NATAL_TEN_GOD_COMMON.hourUnknown}`}`,
    paragraphs: top.length
      ? top.map((t) => ({ label: `${tenGodLabel(t)} ${counts[t]}자리 · 가장 많음`, text: NATAL_TEN_GOD_READINGS[t], rule: `tenGod.prominent.${t}` }))
      : [{ label: null, text: NATAL_TEN_GOD_COMMON.even, rule: "tenGod.even" }],
  };
}

/** 사주 풀이 — 상담 흐름 순서의 섹션 목록 */
export function buildSajuReading(r: SajuResult, nowMs: number): SajuReading {
  const seun = seunSection(r, nowMs);
  return {
    disclaimer: READING_DISCLAIMER,
    sections: [
      gyeokSection(r),
      daeunSection(r, nowMs),
      ...(seun ? [seun] : []),
      dayStemSection(r),
      elementSection(r),
      tenGodSection(r),
    ],
  };
}
