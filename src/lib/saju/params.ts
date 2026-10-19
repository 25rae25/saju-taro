/**
 * URL 검색 파라미터 ↔ 사주 입력. 폼은 GET으로 /saju?… 에 제출한다.
 */
import type { DayBoundary, Gender, SajuInput, TimeCorrection } from "./index";
import { DEFAULT_PLACE_ID, placeById } from "./places";

export interface SajuFormValues {
  cal: "solar" | "lunar";
  y: string;
  m: string;
  d: string;
  leap: boolean;
  time: string; // "HH:MM"
  unknown: boolean;
  g: Gender;
  place: string; // place id 또는 "custom"
  lon: string;
  corr: TimeCorrection;
  zi: DayBoundary;
}

export const DEFAULT_FORM: SajuFormValues = {
  cal: "solar",
  y: "",
  m: "",
  d: "",
  leap: false,
  time: "",
  unknown: false,
  g: "M",
  place: DEFAULT_PLACE_ID,
  lon: "",
  corr: "longitude",
  zi: "23",
};

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function formValuesFrom(sp: Raw): SajuFormValues {
  const pick = <T extends string>(v: string, allowed: readonly T[], fallback: T): T =>
    (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  return {
    cal: pick(one(sp.cal), ["solar", "lunar"], DEFAULT_FORM.cal),
    y: one(sp.y),
    m: one(sp.m),
    d: one(sp.d),
    leap: one(sp.leap) === "1",
    time: one(sp.time),
    unknown: one(sp.unknown) === "1",
    g: pick(one(sp.g), ["M", "F"], DEFAULT_FORM.g),
    place: one(sp.place) || DEFAULT_FORM.place,
    lon: one(sp.lon),
    corr: pick(one(sp.corr), ["standard", "longitude", "apparent"], DEFAULT_FORM.corr),
    zi: pick(one(sp.zi), ["23", "00"], DEFAULT_FORM.zi),
  };
}

/** 폼 값 → 계산 입력. 아직 제출 전이면 null, 잘못된 값이면 오류 메시지. */
export function inputFrom(v: SajuFormValues): { input: SajuInput } | { error: string } | null {
  if (!v.y && !v.m && !v.d) return null;
  const year = Number(v.y), month = Number(v.m), day = Number(v.d);
  if (![year, month, day].every(Number.isInteger)) return { error: "생년월일을 숫자로 입력해 주세요." };

  let time: SajuInput["time"] = null;
  if (!v.unknown) {
    const t = /^(\d{1,2}):(\d{2})$/.exec(v.time);
    if (!t) return { error: "출생 시각을 입력하거나 ‘시간 모름’을 선택해 주세요." };
    time = { hour: Number(t[1]), minute: Number(t[2]) };
  }

  let longitude: number;
  if (v.place === "custom") {
    longitude = Number(v.lon);
    if (!Number.isFinite(longitude) || v.lon.trim() === "") return { error: "출생지 경도를 입력해 주세요 (예: 126.98)." };
  } else {
    const p = placeById(v.place);
    if (!p) return { error: "출생지를 선택해 주세요." };
    longitude = p.longitude;
  }

  return {
    input: {
      calendar: v.cal,
      year,
      month,
      day,
      isLeapMonth: v.cal === "lunar" && v.leap,
      time,
      gender: v.g,
      longitude,
      correction: v.corr,
      dayBoundary: v.zi,
    },
  };
}
