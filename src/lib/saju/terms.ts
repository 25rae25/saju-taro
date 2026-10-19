/**
 * 24절기 순간 조회. 데이터: src/data/solar-terms.json (scripts/gen-solar-terms.ts로 생성).
 */
import data from "@/data/solar-terms.json";
import { SOLAR_TERM_NAMES } from "./constants";

export interface SolarTerm {
  /** 0..23, 양력 1월 소한부터 */
  index: number;
  name: (typeof SOLAR_TERM_NAMES)[number];
  utcMs: number;
  /** 12절(節)이면 true — 월주 경계 */
  isJie: boolean;
}

const years = data.years as Record<string, string[]>;
export const TERM_RANGE = data.meta.range as [number, number];

const ALL: SolarTerm[] = [];
for (let y = TERM_RANGE[0]; y <= TERM_RANGE[1]; y++) {
  years[y].forEach((iso, index) => {
    ALL.push({ index, name: SOLAR_TERM_NAMES[index], utcMs: Date.parse(iso), isJie: index % 2 === 0 });
  });
}
const JIE = ALL.filter((t) => t.isJie);

export function termsOfYear(year: number): SolarTerm[] {
  return ALL.filter((t) => new Date(t.utcMs).getUTCFullYear() === year);
}

function lastAtOrBefore(list: SolarTerm[], utcMs: number): number {
  let lo = 0, hi = list.length - 1;
  if (utcMs < list[0].utcMs || utcMs >= list[hi].utcMs) throw new RangeError("절기 데이터 범위를 벗어났습니다");
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (list[mid].utcMs <= utcMs) lo = mid; else hi = mid - 1;
  }
  return lo;
}

/** 해당 순간이 속한 절(節) 구간: [prev, next) */
export function jieAround(utcMs: number): { prev: SolarTerm; next: SolarTerm } {
  const i = lastAtOrBefore(JIE, utcMs);
  return { prev: JIE[i], next: JIE[i + 1] };
}

/** 해당 순간에 가장 가까운 절기(24기 전체) */
export function nearestTerm(utcMs: number): SolarTerm {
  const i = lastAtOrBefore(ALL, utcMs);
  const a = ALL[i], b = ALL[i + 1];
  return utcMs - a.utcMs <= b.utcMs - utcMs ? a : b;
}

/** 해당 순간 직전의 입춘 */
export function ipchunAtOrBefore(utcMs: number): SolarTerm {
  const i = lastAtOrBefore(JIE, utcMs);
  for (let k = i; k >= 0; k--) if (JIE[k].index === 2) return JIE[k];
  throw new RangeError("입춘 데이터 범위를 벗어났습니다");
}

export const TERMS_META = data.meta;
