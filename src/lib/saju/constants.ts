/**
 * 사주 기본 규칙 데이터.
 * 출처와 유파 선택은 docs/DATA.md의 "사주 규칙" 절에 정리했다.
 */

export type Element = "목" | "화" | "토" | "금" | "수";
export type YinYang = "양" | "음";

export const ELEMENTS: readonly Element[] = ["목", "화", "토", "금", "수"];
export const ELEMENT_HANJA: Record<Element, string> = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };

export interface Stem {
  index: number;
  ko: string;
  hanja: string;
  element: Element;
  yinYang: YinYang;
}

export interface Branch {
  index: number;
  ko: string;
  hanja: string;
  element: Element;
  /** 체(體) 기준 음양 — 지지 순서의 홀짝. 십신은 정기(본기) 천간으로 따지므로 이 값을 쓰지 않는다. */
  yinYang: YinYang;
  animal: string;
  /** 지장간 [여기, 중기, 정기] — 각 [천간 인덱스, 일수]. 마지막이 정기(본기). */
  hidden: readonly (readonly [number, number])[];
}

const STEM_KO = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEM_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

export const STEMS: readonly Stem[] = STEM_KO.map((ko, i) => ({
  index: i,
  ko,
  hanja: STEM_HANJA[i],
  element: ELEMENTS[Math.floor(i / 2)],
  yinYang: i % 2 === 0 ? "양" : "음",
}));

// 천간 인덱스: 갑0 을1 병2 정3 무4 기5 경6 신7 임8 계9
// 지장간: 국내 통용 월률분야표(연해자평 계열). 신(申)의 여기는 무(戊)로 둔다.
const BRANCH_ROWS: [string, string, Element, string, [number, number][]][] = [
  ["자", "子", "수", "쥐", [[8, 10], [9, 20]]],
  ["축", "丑", "토", "소", [[9, 9], [7, 3], [5, 18]]],
  ["인", "寅", "목", "호랑이", [[4, 7], [2, 7], [0, 16]]],
  ["묘", "卯", "목", "토끼", [[0, 10], [1, 20]]],
  ["진", "辰", "토", "용", [[1, 9], [9, 3], [4, 18]]],
  ["사", "巳", "화", "뱀", [[4, 7], [6, 7], [2, 16]]],
  ["오", "午", "화", "말", [[2, 10], [5, 9], [3, 11]]],
  ["미", "未", "토", "양", [[3, 9], [1, 3], [5, 18]]],
  ["신", "申", "금", "원숭이", [[4, 7], [8, 7], [6, 16]]],
  ["유", "酉", "금", "닭", [[6, 10], [7, 20]]],
  ["술", "戌", "토", "개", [[7, 9], [3, 3], [4, 18]]],
  ["해", "亥", "수", "돼지", [[4, 7], [0, 7], [8, 16]]],
];

export const BRANCHES: readonly Branch[] = BRANCH_ROWS.map(([ko, hanja, element, animal, hidden], i) => ({
  index: i,
  ko,
  hanja,
  element,
  yinYang: i % 2 === 0 ? "양" : "음",
  animal,
  hidden,
}));

/** 지지의 정기(본기) 천간 인덱스 */
export function mainHiddenStem(branchIndex: number): number {
  const h = BRANCHES[branchIndex].hidden;
  return h[h.length - 1][0];
}

export interface Pillar {
  stem: number;
  branch: number;
}

/** 60갑자 순번(0 = 갑자) → 간지 */
export function sexagenary(n: number): Pillar {
  const i = ((n % 60) + 60) % 60;
  return { stem: i % 10, branch: i % 12 };
}

/** 간지 → 60갑자 순번 */
export function sexagenaryIndex(p: Pillar): number {
  // stem ≡ i (mod 10), branch ≡ i (mod 12) 를 만족하는 0..59
  for (let i = p.stem; i < 60; i += 10) if (i % 12 === p.branch) return i;
  throw new Error(`존재하지 않는 간지: ${p.stem}/${p.branch}`);
}

export function pillarKo(p: Pillar): string {
  return STEMS[p.stem].ko + BRANCHES[p.branch].ko;
}

export function pillarHanja(p: Pillar): string {
  return STEMS[p.stem].hanja + BRANCHES[p.branch].hanja;
}

// ── 십신 ────────────────────────────────────────────────

export type TenGod = "비견" | "겁재" | "식신" | "상관" | "편재" | "정재" | "편관" | "정관" | "편인" | "정인";

const GENERATES = (e: number) => (e + 1) % 5; // 목→화→토→금→수→목
const CONTROLS = (e: number) => (e + 2) % 5; // 목→토→수→화→금→목

/** 일간(dayStem) 기준으로 다른 천간(other)의 십신 */
export function tenGod(dayStem: number, other: number): TenGod {
  const me = Math.floor(dayStem / 2);
  const it = Math.floor(other / 2);
  const same = dayStem % 2 === other % 2;
  if (it === me) return same ? "비견" : "겁재";
  if (it === GENERATES(me)) return same ? "식신" : "상관";
  if (it === CONTROLS(me)) return same ? "편재" : "정재";
  if (me === CONTROLS(it)) return same ? "편관" : "정관";
  if (me === GENERATES(it)) return same ? "편인" : "정인";
  throw new Error("unreachable");
}

// ── 12운성 ──────────────────────────────────────────────

export const TWELVE_STAGES = ["장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"] as const;
export type TwelveStage = (typeof TWELVE_STAGES)[number];

/**
 * 각 천간의 장생 지지. 양간은 순행, 음간은 역행(양순음역).
 * 토(戊·己)는 화(丙·丁)를 따른다(화토동법).
 */
const CHANGSAENG: readonly number[] = [
  11, // 갑 → 해
  6, //  을 → 오
  2, //  병 → 인
  9, //  정 → 유
  2, //  무 → 인 (화토동법)
  9, //  기 → 유 (화토동법)
  5, //  경 → 사
  0, //  신 → 자
  8, //  임 → 신
  3, //  계 → 묘
];

export function twelveStage(stem: number, branch: number): TwelveStage {
  const start = CHANGSAENG[stem];
  const step = stem % 2 === 0 ? (branch - start + 12) % 12 : (start - branch + 12) % 12;
  return TWELVE_STAGES[step];
}

// ── 절기 ────────────────────────────────────────────────

/** solar-terms.json 배열 순서(양력 1월 소한부터)의 절기 이름 */
export const SOLAR_TERM_NAMES = [
  "소한", "대한", "입춘", "우수", "경칩", "춘분", "청명", "곡우", "입하", "소만", "망종", "하지",
  "소서", "대서", "입추", "처서", "백로", "추분", "한로", "상강", "입동", "소설", "대설", "동지",
] as const;

/**
 * 월주를 가르는 12절(節). solar-terms.json의 짝수 인덱스(0 소한, 2 입춘, …, 22 대설).
 * 절 인덱스 k(=배열 인덱스/2)일 때 월지 = (k + 1) % 12 → 소한=축, 입춘=인, …, 대설=자.
 */
export function monthBranchForJie(jieOrdinal: number): number {
  return (jieOrdinal + 1) % 12;
}
