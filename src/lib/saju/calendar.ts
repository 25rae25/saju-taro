/**
 * 한국 음력 ↔ 양력. korean-lunar-calendar (MIT, 한국천문연구원 기준 데이터) 래퍼.
 * 이 라이브러리의 연·월 간지는 음력 기준이라 사주 연주·월주에 쓰지 않는다 — 날짜 변환에만 쓴다.
 */
import KoreanLunarCalendar from "korean-lunar-calendar";

export const LUNAR_RANGE = { from: "1000-01-01", to: "2050-11-18" } as const;

export interface YMD {
  year: number;
  month: number;
  day: number;
}

export function lunarToSolar(year: number, month: number, day: number, isLeapMonth: boolean): YMD | null {
  const c = new KoreanLunarCalendar();
  if (!c.setLunarDate(year, month, day, isLeapMonth)) return null;
  const s = c.getSolarCalendar();
  return { year: s.year, month: s.month, day: s.day };
}

export function solarToLunar(year: number, month: number, day: number): (YMD & { isLeapMonth: boolean }) | null {
  const c = new KoreanLunarCalendar();
  if (!c.setSolarDate(year, month, day)) return null;
  const l = c.getLunarCalendar();
  return { year: l.year, month: l.month, day: l.day, isLeapMonth: !!l.intercalation };
}

export function isValidSolarDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}
