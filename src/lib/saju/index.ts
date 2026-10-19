/**
 * 사주팔자 명식 계산.
 *
 * 규칙 요약 (자세한 근거는 docs/DATA.md):
 * - 연주: 입춘 순간 기준. 월주: 12절(節) 순간 기준, 월간은 연간에서 정한다(갑기년 병인월 …).
 * - 일주: JDN 기반 60갑자 (2000-01-01 = 무오일). 보정된 현지 태양시의 날짜를 쓴다.
 * - 시주: 보정된 현지 태양시로 시지, 일간에서 시간(갑기일 갑자시 …). 23시~24시는 다음 날 자시 천간.
 * - 일주 경계(dayBoundary): "23" = 자시 시작(23시)에 날이 바뀜, "00" = 자정에 바뀜(야자시·조자시 구분).
 * - 대운: 양남음녀 순행·음남양녀 역행, 다음/이전 절까지 일수 ÷ 3 = 대운 시작 나이(년).
 */
import {
  BRANCHES, ELEMENTS, STEMS, type Element, type Pillar, type TenGod, type TwelveStage,
  monthBranchForJie, pillarHanja, pillarKo, sexagenary, sexagenaryIndex, tenGod, twelveStage,
} from "./constants";
import { isValidSolarDate, lunarToSolar, solarToLunar, type YMD } from "./calendar";
import { ipchunAtOrBefore, jieAround, type SolarTerm } from "./terms";
import {
  DAY, MIN, julianDayNumber, partsOfLocalMs, seoulOffsetAt, seoulWallToUtc, solarLocalMs, type TimeCorrection,
} from "./time";

export type { TimeCorrection } from "./time";
export type DayBoundary = "23" | "00";
export type Gender = "M" | "F";

export interface SajuInput {
  calendar: "solar" | "lunar";
  year: number;
  month: number;
  day: number;
  isLeapMonth?: boolean;
  /** null이면 시간 모름 — 시주를 비우고 정오로 연·월·대운을 계산한다 */
  time: { hour: number; minute: number } | null;
  gender: Gender;
  /** 출생지 경도(동경, 도) */
  longitude: number;
  correction: TimeCorrection;
  dayBoundary: DayBoundary;
}

export class SajuInputError extends Error {}

export const SOLAR_INPUT_RANGE = { fromYear: 1900, toYear: 2100 } as const;

export interface HiddenStemInfo {
  stem: number;
  ko: string;
  hanja: string;
  days: number;
  tenGod: TenGod;
}

export interface PillarInfo {
  pillar: Pillar;
  ko: string;
  hanja: string;
  stemTenGod: TenGod | null; // 일간 자신은 null
  branchTenGod: TenGod;
  hidden: HiddenStemInfo[];
  /** 일간 기준 12운성 */
  twelveStage: TwelveStage;
}

export interface DaeunItem extends PillarInfo {
  order: number;
  /** 관례 표기 나이(대운수 + 10×순번) */
  label: number;
  /** 정확한 시작 나이(만, 년 단위 소수) */
  startAgeExact: number;
  startUtcMs: number;
}

export interface SeunItem extends PillarInfo {
  year: number;
}

export interface SajuResult {
  input: SajuInput;
  solarDate: YMD;
  lunarDate: (YMD & { isLeapMonth: boolean }) | null;
  timeKnown: boolean;
  birthUtcMs: number;
  clock: { offsetMin: number; dst: boolean; resolution: "ok" | "ambiguous" | "gap" };
  /** 일주·시주 계산에 쓴 보정 시각 (null = 시간 모름) */
  solarTime: { year: number; month: number; day: number; hour: number; minute: number; second: number } | null;
  /** 보정 시각 − 입력 시계 시각 (분) */
  correctionMinutes: number | null;
  pillars: { year: PillarInfo; month: PillarInfo; day: PillarInfo; hour: PillarInfo | null };
  elements: Record<Element, number>;
  jie: { prev: SolarTerm; next: SolarTerm };
  /** 연주를 정한 입춘 */
  ipchun: SolarTerm;
  daeun: {
    forward: boolean;
    deltaDays: number;
    number: number;
    startAge: { years: number; months: number };
    startUtcMs: number;
    items: DaeunItem[];
  };
  seun: SeunItem[];
  /** 같은 입력을 다른 보정 방식으로 계산한 일주·시주 (차이 확인용) */
  alternatives: { correction: TimeCorrection; dayBoundary: DayBoundary; day: string; hour: string | null }[];
  warnings: string[];
}

const pad = (n: number) => String(n).padStart(2, "0");

function pillarInfo(p: Pillar, dayStem: number, isDayPillar = false): PillarInfo {
  const hidden = BRANCHES[p.branch].hidden.map(([stem, days]) => ({
    stem,
    ko: STEMS[stem].ko,
    hanja: STEMS[stem].hanja,
    days,
    tenGod: tenGod(dayStem, stem),
  }));
  return {
    pillar: p,
    ko: pillarKo(p),
    hanja: pillarHanja(p),
    stemTenGod: isDayPillar ? null : tenGod(dayStem, p.stem),
    branchTenGod: hidden[hidden.length - 1].tenGod,
    hidden,
    twelveStage: twelveStage(dayStem, p.branch),
  };
}

function dayPillarOf(year: number, month: number, day: number): Pillar {
  return sexagenary(julianDayNumber(year, month, day) + 49);
}

function addDays(ymd: YMD, n: number): YMD {
  const d = new Date(Date.UTC(ymd.year, ymd.month - 1, ymd.day) + n * DAY);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** 보정 시각 → 일주·시주 */
function dayAndHour(localMs: number, dayBoundary: DayBoundary) {
  const t = partsOfLocalMs(localMs);
  const date: YMD = { year: t.year, month: t.month, day: t.day };
  const late = t.minutesOfDay >= 23 * 60;
  const dayDate = dayBoundary === "23" && late ? addDays(date, 1) : date;
  const day = dayPillarOf(dayDate.year, dayDate.month, dayDate.day);
  const hourBranch = Math.floor((t.minutesOfDay + 60) / 120) % 12;
  const stemDate = late ? addDays(date, 1) : date; // 23시~24시는 다음 날 자시의 천간
  const stemDay = dayPillarOf(stemDate.year, stemDate.month, stemDate.day).stem;
  const hour: Pillar = { stem: ((stemDay % 5) * 2 + hourBranch) % 10, branch: hourBranch };
  return { t, day, hour };
}

const CORRECTION_LABEL: Record<TimeCorrection, string> = {
  standard: "표준시",
  longitude: "경도 보정",
  apparent: "진태양시",
};

export function computeSaju(input: SajuInput, now: Date = new Date()): SajuResult {
  const warnings: string[] = [];

  // 1) 양력 날짜
  let solarDate: YMD;
  if (input.calendar === "lunar") {
    const s = lunarToSolar(input.year, input.month, input.day, !!input.isLeapMonth);
    if (!s) {
      throw new SajuInputError(
        input.isLeapMonth
          ? `음력 ${input.year}년에는 윤${input.month}월이 없거나 날짜가 범위를 벗어났습니다.`
          : `음력 ${input.year}년 ${input.month}월 ${input.day}일은 존재하지 않는 날짜입니다.`,
      );
    }
    solarDate = s;
  } else {
    if (!isValidSolarDate(input.year, input.month, input.day)) {
      throw new SajuInputError(`양력 ${input.year}-${pad(input.month)}-${pad(input.day)}은 존재하지 않는 날짜입니다.`);
    }
    solarDate = { year: input.year, month: input.month, day: input.day };
  }
  if (solarDate.year < SOLAR_INPUT_RANGE.fromYear || solarDate.year > SOLAR_INPUT_RANGE.toYear) {
    throw new SajuInputError(`${SOLAR_INPUT_RANGE.fromYear}~${SOLAR_INPUT_RANGE.toYear}년 출생만 계산할 수 있습니다.`);
  }
  if (input.time && (input.time.hour < 0 || input.time.hour > 23 || input.time.minute < 0 || input.time.minute > 59)) {
    throw new SajuInputError("출생 시각이 올바르지 않습니다.");
  }
  if (!(input.longitude >= 120 && input.longitude <= 135)) {
    throw new SajuInputError("출생지 경도는 동경 120°~135° 사이여야 합니다(한반도 기준).");
  }
  const lunarDate = solarToLunar(solarDate.year, solarDate.month, solarDate.day);

  // 2) UTC 순간
  const timeKnown = input.time !== null;
  const wall = { ...solarDate, hour: input.time?.hour ?? 12, minute: input.time?.minute ?? 0 };
  const resolved = seoulWallToUtc(wall);
  const birthUtcMs = resolved.utcMs;
  const clock = { ...seoulOffsetAt(birthUtcMs), resolution: resolved.kind };
  if (timeKnown) {
    if (resolved.kind === "gap") {
      warnings.push("입력한 시각은 서머타임 시작으로 시계를 앞당긴 구간이라 실제로 존재하지 않습니다. 직전 표준시로 계산했습니다.");
    } else if (resolved.kind === "ambiguous") {
      warnings.push("입력한 시각은 서머타임 종료로 시계를 되돌린 구간이라 두 번 있었습니다. 앞쪽(서머타임) 시각으로 계산했습니다.");
    }
    if (clock.dst) warnings.push("서머타임 기간 출생입니다. 시계 시각에서 1시간을 빼서 계산했습니다.");
  }

  // 3) 연주·월주 (절기 순간과 직접 비교)
  const ipchun = ipchunAtOrBefore(birthUtcMs);
  const sajuYear = new Date(ipchun.utcMs).getUTCFullYear();
  const yearPillar = sexagenary(sajuYear - 4);
  const jie = jieAround(birthUtcMs);
  const monthBranch = monthBranchForJie(jie.prev.index / 2);
  const inStem = ((yearPillar.stem % 5) * 2 + 2) % 10; // 인월 천간
  const monthPillar: Pillar = { stem: (inStem + ((monthBranch - 2 + 12) % 12)) % 10, branch: monthBranch };

  // 4) 일주·시주
  let dayPillar: Pillar;
  let hourPillar: Pillar | null = null;
  let solarTime: SajuResult["solarTime"] = null;
  let correctionMinutes: number | null = null;
  if (timeKnown) {
    const localMs = solarLocalMs(birthUtcMs, input.correction, input.longitude);
    const dh = dayAndHour(localMs, input.dayBoundary);
    dayPillar = dh.day;
    hourPillar = dh.hour;
    solarTime = { year: dh.t.year, month: dh.t.month, day: dh.t.day, hour: dh.t.hour, minute: dh.t.minute, second: dh.t.second };
    correctionMinutes = Math.round(((localMs - Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute)) / MIN) * 10) / 10;

    const m = dh.t.minutesOfDay;
    const toBoundary = (((m - 60) % 120) + 120) % 120;
    const dist = Math.min(toBoundary, 120 - toBoundary);
    if (dist < 10) {
      warnings.push(`보정 시각(${pad(dh.t.hour)}:${pad(dh.t.minute)})이 시진 경계와 ${Math.round(dist)}분 차이입니다. 출생 시각이 조금만 달라도 시주가 바뀝니다.`);
    }
  } else {
    dayPillar = dayPillarOf(solarDate.year, solarDate.month, solarDate.day);
    warnings.push("출생 시각을 모르면 시주를 비우고, 연·월주와 대운은 정오(12:00) 기준으로 계산합니다.");
  }

  // 절입 경계 경고
  const nearPrev = (birthUtcMs - jie.prev.utcMs) / MIN;
  const nearNext = (jie.next.utcMs - birthUtcMs) / MIN;
  const near = nearPrev < nearNext ? { term: jie.prev, min: nearPrev } : { term: jie.next, min: nearNext };
  const nearLimit = timeKnown ? 120 : 12 * 60;
  if (near.min < nearLimit) {
    const what = near.term.index === 2 ? "연주·월주" : "월주";
    warnings.push(
      timeKnown
        ? `출생 순간이 ${near.term.name} 절입과 ${Math.round(near.min)}분 차이입니다. 출생 시각이 정확하지 않으면 ${what}가 바뀔 수 있습니다.`
        : `출생일에 ${near.term.name} 절입이 있습니다. 시간을 모르면 ${what}를 확정할 수 없습니다.`,
    );
  }

  const dayStem = dayPillar.stem;
  const pillars = {
    year: pillarInfo(yearPillar, dayStem),
    month: pillarInfo(monthPillar, dayStem),
    day: pillarInfo(dayPillar, dayStem, true),
    hour: hourPillar ? pillarInfo(hourPillar, dayStem) : null,
  };

  // 5) 오행 분포 (천간·지지 글자 수)
  const elements = Object.fromEntries(ELEMENTS.map((e) => [e, 0])) as Record<Element, number>;
  for (const p of [yearPillar, monthPillar, dayPillar, hourPillar]) {
    if (!p) continue;
    elements[STEMS[p.stem].element]++;
    elements[BRANCHES[p.branch].element]++;
  }

  // 6) 대운
  const yangYear = yearPillar.stem % 2 === 0;
  const forward = (yangYear && input.gender === "M") || (!yangYear && input.gender === "F");
  const deltaMs = forward ? jie.next.utcMs - birthUtcMs : birthUtcMs - jie.prev.utcMs;
  const deltaDays = deltaMs / DAY;
  const startAgeExact = deltaDays / 3;
  const daeunNumber = Math.max(1, Math.round(startAgeExact));
  const YEAR_MS = 365.2425 * DAY;
  const monthIdx = sexagenaryIndex(monthPillar);
  const items: DaeunItem[] = Array.from({ length: 10 }, (_, k) => {
    const p = sexagenary(monthIdx + (forward ? k + 1 : -(k + 1)));
    const age = startAgeExact + 10 * k;
    return { ...pillarInfo(p, dayStem), order: k + 1, label: daeunNumber + 10 * k, startAgeExact: age, startUtcMs: birthUtcMs + age * YEAR_MS };
  });
  const totalMonths = Math.floor(startAgeExact * 12);
  if (!timeKnown) warnings.push("대운 시작 시기는 출생 시각을 정오로 가정한 근사값입니다.");

  // 7) 세운 (올해부터 10년)
  const thisYear = new Date(now.getTime() + 9 * 3600e3).getUTCFullYear();
  const seun: SeunItem[] = Array.from({ length: 10 }, (_, k) => ({
    year: thisYear + k,
    ...pillarInfo(sexagenary(thisYear + k - 4), dayStem),
  }));

  // 8) 보정 방식별 비교
  const alternatives: SajuResult["alternatives"] = [];
  if (timeKnown) {
    for (const correction of ["standard", "longitude", "apparent"] as const) {
      for (const dayBoundary of ["23", "00"] as const) {
        const dh = dayAndHour(solarLocalMs(birthUtcMs, correction, input.longitude), dayBoundary);
        alternatives.push({ correction, dayBoundary, day: pillarKo(dh.day), hour: pillarKo(dh.hour) });
      }
    }
    const differing = alternatives.filter((a) => a.day !== pillars.day.ko || a.hour !== pillars.hour!.ko);
    if (differing.length) {
      const labels = [...new Set(differing.map((a) => `${CORRECTION_LABEL[a.correction]}·${a.dayBoundary}시 기준이면 ${a.day}일 ${a.hour}시`))];
      warnings.push(`시간 보정 방식이나 자시 기준에 따라 결과가 달라집니다: ${labels.join(", ")}.`);
    }
  }

  return {
    input,
    solarDate,
    lunarDate,
    timeKnown,
    birthUtcMs,
    clock,
    solarTime,
    correctionMinutes,
    pillars,
    elements,
    jie,
    ipchun,
    daeun: {
      forward,
      deltaDays,
      number: daeunNumber,
      startAge: { years: Math.floor(totalMonths / 12), months: totalMonths % 12 },
      startUtcMs: birthUtcMs + startAgeExact * YEAR_MS,
      items,
    },
    seun,
    alternatives,
    warnings,
  };
}

export { CORRECTION_LABEL };
