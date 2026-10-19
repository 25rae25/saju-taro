/**
 * 출생 시각 → UTC 순간, 그리고 시주·일주용 "태양시" 보정.
 *
 * - 시계 시각(한국 당시 표준시, 서머타임 포함) → UTC: src/data/seoul-tz.json (IANA tz).
 * - 연주·월주는 UTC 순간을 절기 순간과 직접 비교하므로 보정과 무관하다.
 * - 일주·시주는 보정 방식에 따라 달라진다:
 *     standard  : 당시 표준시(서머타임만 제거)
 *     longitude : 지방평균시 = UTC + 경도×4분
 *     apparent  : 진태양시 = 지방평균시 + 균시차 (astronomy-engine 태양 시각(時角))
 */
import * as Astronomy from "astronomy-engine";
import tz from "@/data/seoul-tz.json";

export type TimeCorrection = "standard" | "longitude" | "apparent";

const MIN = 60_000;
const DAY = 86_400_000;

interface Span {
  fromMs: number;
  offsetMin: number;
  dst: boolean;
}

const SPANS: Span[] = [
  { fromMs: -Infinity, offsetMin: tz.initialOffsetMinutes, dst: false },
  ...tz.transitions.map((t) => ({ fromMs: Date.parse(t.utc), offsetMin: t.offsetMinutes, dst: t.dst })),
];

function spanAt(utcMs: number): Span {
  let lo = 0, hi = SPANS.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (SPANS[mid].fromMs <= utcMs) lo = mid; else hi = mid - 1;
  }
  return SPANS[lo];
}

/** 해당 UTC 순간의 서울 시계 오프셋(분)과 서머타임 여부 */
export function seoulOffsetAt(utcMs: number): { offsetMin: number; dst: boolean } {
  const s = spanAt(utcMs);
  return { offsetMin: s.offsetMin, dst: s.dst };
}

export interface WallTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/** 벽시계 값을 UTC로 착각한 ms (시간대 계산용 보조 값) */
export function wallAsUtcMs(w: WallTime): number {
  return Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute);
}

export type WallResolution =
  | { kind: "ok"; utcMs: number }
  | { kind: "ambiguous"; utcMs: number; alternativeUtcMs: number } // 시계를 되돌린 구간 — 같은 시각이 두 번
  | { kind: "gap"; utcMs: number }; // 시계를 앞당긴 구간 — 존재하지 않는 시각

/**
 * 서울 시계 시각 → UTC.
 * 겹치는 시각은 앞쪽(서머타임 쪽) 순간을, 없는 시각은 전환 직전 오프셋으로 계산한 순간을 돌려주고 kind로 알린다.
 */
export function seoulWallToUtc(w: WallTime): WallResolution {
  const wall = wallAsUtcMs(w);
  const offsets = [...new Set(SPANS.map((s) => s.offsetMin))];
  const matches = offsets
    .map((o) => wall - o * MIN)
    .filter((utc) => Math.abs(spanAt(utc).offsetMin * MIN - (wall - utc)) < 1)
    .sort((a, b) => a - b);
  if (matches.length === 1) return { kind: "ok", utcMs: matches[0] };
  if (matches.length >= 2) return { kind: "ambiguous", utcMs: matches[0], alternativeUtcMs: matches[matches.length - 1] };
  // gap: 전환 직전 오프셋 기준
  const before = spanAt(wall - 12 * 60 * MIN);
  return { kind: "gap", utcMs: wall - before.offsetMin * MIN };
}

/** 균시차(분): 진태양시 − 평균태양시 */
export function equationOfTimeMinutes(utcMs: number, longitude: number): number {
  const observer = new Astronomy.Observer(37.5, longitude, 0); // 위도는 시각(時角)에 영향 없음
  const ha = Astronomy.HourAngle(Astronomy.Body.Sun, new Date(utcMs), observer); // 0..24 (항성시 아닌 태양 시각)
  const apparentHours = (ha + 12) % 24;
  const meanHours = (((utcMs / 3600_000 + longitude / 15) % 24) + 24) % 24;
  let diff = (apparentHours - meanHours) * 60;
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
}

/**
 * 보정된 "현지 태양시"를 벽시계 형태의 ms(UTC 필드로 읽음)로 돌려준다.
 * 반환값을 new Date(x).getUTC*()로 읽으면 보정된 날짜·시각이 나온다.
 */
export function solarLocalMs(utcMs: number, correction: TimeCorrection, longitude: number): number {
  switch (correction) {
    case "standard": {
      const s = spanAt(utcMs);
      return utcMs + (s.offsetMin - (s.dst ? 60 : 0)) * MIN;
    }
    case "longitude":
      return utcMs + longitude * 4 * MIN;
    case "apparent":
      return utcMs + longitude * 4 * MIN + equationOfTimeMinutes(utcMs, longitude) * MIN;
  }
}

export function partsOfLocalMs(ms: number) {
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    minutesOfDay: d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60,
  };
}

/** 율리우스 일수(JDN) — 그레고리력 날짜 */
export function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export { DAY, MIN };
