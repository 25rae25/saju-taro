/**
 * 음력↔양력, 일진, 한국 표준시 변천 검증.
 * 기준값: 한국천문연구원 음양력변환계산(astro.kasi.re.kr/life/pageView/8), IANA tz.
 */
import { describe, expect, test } from "vitest";
import { lunarToSolar, solarToLunar } from "@/lib/saju/calendar";
import { equationOfTimeMinutes, seoulWallToUtc, solarLocalMs } from "@/lib/saju/time";
import { computeSaju } from "@/lib/saju";

describe("음력 → 양력 (KASI)", () => {
  test.each([
    [2023, 2, 1, false, "2023-02-20"],
    [2023, 2, 1, true, "2023-03-22"], // 윤2월
    [2023, 2, 15, true, "2023-04-05"],
    [2020, 4, 1, false, "2020-04-23"],
    [2020, 4, 1, true, "2020-05-23"], // 윤4월
    [2025, 6, 1, false, "2025-06-25"],
    [2025, 6, 1, true, "2025-07-25"], // 윤6월
    [2028, 5, 1, true, "2028-06-23"], // 윤5월
    [2033, 11, 1, true, "2033-12-22"], // 윤11월
    [2024, 1, 1, false, "2024-02-10"], // 설날
    [2025, 1, 1, false, "2025-01-29"],
    [2026, 1, 1, false, "2026-02-17"],
    // 한국과 중국 설날이 다른 해 (중국: 1997-02-07, 2027-02-06, 2028-01-26)
    [1997, 1, 1, false, "1997-02-08"],
    [2027, 1, 1, false, "2027-02-07"],
    [2028, 1, 1, false, "2028-01-27"],
  ] as const)("음력 %i-%i-%i 윤:%s → %s", (y, m, d, leap, expected) => {
    const s = lunarToSolar(y, m, d, leap);
    expect(s && `${s.year}-${String(s.month).padStart(2, "0")}-${String(s.day).padStart(2, "0")}`).toBe(expected);
  });

  test("없는 윤달은 거부", () => {
    expect(lunarToSolar(2024, 2, 1, true)).toBeNull();
    expect(lunarToSolar(2023, 3, 1, true)).toBeNull();
  });

  test("양력 → 음력 왕복", () => {
    expect(solarToLunar(2023, 3, 22)).toEqual({ year: 2023, month: 2, day: 1, isLeapMonth: true });
    expect(solarToLunar(2026, 10, 19)).toEqual({ year: 2026, month: 9, day: 9, isLeapMonth: false });
  });
});

describe("일진 (KASI)", () => {
  const dayOf = (y: number, m: number, d: number) =>
    computeSaju({ calendar: "solar", year: y, month: m, day: d, time: null, gender: "M", longitude: 126.978, correction: "longitude", dayBoundary: "23" })
      .pillars.day.ko;
  test.each([
    [2000, 1, 1, "무오"],
    [2024, 2, 4, "무술"],
    [2024, 2, 10, "갑진"],
    [2026, 10, 19, "병인"],
    [1988, 2, 4, "기축"],
  ] as const)("%i-%i-%i = %s일", (y, m, d, expected) => expect(dayOf(y, m, d)).toBe(expected));
});

describe("한국 표준시 변천 (IANA tz)", () => {
  const utc = (y: number, mo: number, d: number, h: number, mi: number) => seoulWallToUtc({ year: y, month: mo, day: d, hour: h, minute: mi });
  test.each([
    [1905, 6, 1, 12, 0, "1905-06-01T03:32:08.000Z"], // 지방평균시 +8:27:52
    [1910, 6, 1, 12, 0, "1910-06-01T03:30:00.000Z"], // +8:30
    [1950, 1, 1, 12, 0, "1950-01-01T03:00:00.000Z"], // +9
    [1956, 1, 1, 12, 0, "1956-01-01T03:30:00.000Z"], // +8:30
    [1955, 6, 1, 12, 0, "1955-06-01T02:30:00.000Z"], // +8:30 + 서머타임 = +9:30
    [1961, 8, 9, 23, 0, "1961-08-09T14:30:00.000Z"], // 전환 직전 +8:30
    [1961, 8, 10, 1, 0, "1961-08-09T16:00:00.000Z"], // 전환 직후 +9
    [1987, 7, 1, 10, 0, "1987-07-01T00:00:00.000Z"], // 서머타임 +10
    [1990, 1, 1, 12, 0, "1990-01-01T03:00:00.000Z"],
  ] as const)("%i-%i-%i %i:%i → %s", (y, mo, d, h, mi, expected) => {
    expect(new Date(utc(y, mo, d, h, mi).utcMs).toISOString()).toBe(expected);
  });

  test("서머타임 시작 — 없는 시각", () => expect(utc(1987, 5, 10, 2, 30).kind).toBe("gap"));
  test("서머타임 종료 — 두 번 있는 시각", () => {
    const r = utc(1987, 10, 11, 2, 30);
    expect(r.kind).toBe("ambiguous");
    if (r.kind === "ambiguous") expect(r.alternativeUtcMs - r.utcMs).toBe(3600e3);
  });
});

describe("시간 보정", () => {
  const u = Date.parse("1990-05-15T05:30:00Z"); // KST 14:30
  test("경도 보정: 서울 126.978° → −32.1분", () => {
    const local = solarLocalMs(u, "longitude", 126.978);
    expect((local - (u + 9 * 3600e3)) / 60000).toBeCloseTo(-32.088, 2);
  });
  test("표준시: 서머타임만 제거", () => {
    const dst = Date.parse("1987-07-01T00:00:00Z"); // 시계 10:00 (서머타임)
    expect(new Date(solarLocalMs(dst, "standard", 126.978)).toISOString()).toBe("1987-07-01T09:00:00.000Z");
  });
  // 균시차 기준값: 11월 초 약 +16.4분, 2월 중순 약 −14.2분 (천문 연감 통용값)
  test("균시차 — 11/3 약 +16.4분, 2/11 약 −14.2분", () => {
    expect(equationOfTimeMinutes(Date.parse("2026-11-03T03:00:00Z"), 127)).toBeCloseTo(16.4, 0);
    expect(equationOfTimeMinutes(Date.parse("2026-02-11T03:00:00Z"), 127)).toBeCloseTo(-14.2, 0);
  });
});
