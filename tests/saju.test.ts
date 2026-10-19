/**
 * 사주 명식 검증 — 입춘·절기 경계, 자정·자시 경계, 대운, 그리고 lunar-javascript와의 무작위 교차 검증.
 * 경계 시각은 KASI 발표값(분)을 기준으로 잡고, 분 단위 반올림 오차를 피하려고 ±5분 이상 떨어진 시각을 쓴다.
 */
import { createRequire } from "node:module";
import { describe, expect, test } from "vitest";
import { computeSaju, SajuInputError, type SajuInput } from "@/lib/saju";
import { pillarKo, sexagenary } from "@/lib/saju/constants";
import { jieAround } from "@/lib/saju/terms";
import { seoulOffsetAt, solarLocalMs } from "@/lib/saju/time";

const require = createRequire(import.meta.url);
const { Solar } = require("lunar-javascript");

const SEOUL = 126.978;

function saju(date: string, time: string | null, opts: Partial<SajuInput> = {}) {
  const [y, m, d] = date.split("-").map(Number);
  const t = time ? { hour: Number(time.slice(0, 2)), minute: Number(time.slice(3, 5)) } : null;
  return computeSaju(
    { calendar: "solar", year: y, month: m, day: d, time: t, gender: "M", longitude: SEOUL, correction: "longitude", dayBoundary: "23", ...opts },
    new Date("2026-10-19T03:00:00Z"),
  );
}
const ym = (r: ReturnType<typeof saju>) => `${r.pillars.year.ko} ${r.pillars.month.ko}`;
const four = (r: ReturnType<typeof saju>) =>
  [r.pillars.year.ko, r.pillars.month.ko, r.pillars.day.ko, r.pillars.hour?.ko ?? "-"].join(" ");

describe("입춘 경계 — 연주·월주 (KASI 시각 기준)", () => {
  test("2024 입춘 02-04 17:27", () => {
    expect(ym(saju("2024-02-04", "17:20"))).toBe("계묘 을축");
    expect(ym(saju("2024-02-04", "17:35"))).toBe("갑진 병인");
  });
  test("2025 입춘 02-03 23:10", () => {
    expect(ym(saju("2025-02-03", "23:00"))).toBe("갑진 정축");
    expect(ym(saju("2025-02-03", "23:20"))).toBe("을사 무인");
  });
  test("2021 입춘 02-03 23:59 — 자정 직전 절입", () => {
    expect(ym(saju("2021-02-03", "23:50"))).toBe("경자 기축");
    expect(ym(saju("2021-02-04", "00:10"))).toBe("신축 경인");
  });
  test("양력 1월생은 입춘 전이라 전년도 연주", () => {
    expect(ym(saju("2026-01-20", "12:00"))).toBe("을사 기축");
  });
});

describe("절기 경계 — 월주 (KASI 시각 기준)", () => {
  test.each([
    ["2026-01-05", "17:15", "17:30", "을사 무자", "을사 기축"], // 소한 17:23 — 연주는 그대로
    ["2026-03-05", "22:50", "23:05", "병오 경인", "병오 신묘"], // 경칩 22:59
    ["2026-06-06", "00:40", "00:55", "병오 계사", "병오 갑오"], // 망종 00:48
    ["2026-10-08", "15:20", "15:40", "병오 정유", "병오 무술"], // 한로 15:29
    ["2024-12-07", "00:10", "00:25", "갑진 을해", "갑진 병자"], // 대설 00:17
  ])("%s %s / %s", (date, before, after, exp1, exp2) => {
    expect(ym(saju(date, before))).toBe(exp1);
    expect(ym(saju(date, after))).toBe(exp2);
  });

  test("경계 근처면 경고", () => {
    expect(saju("2026-03-05", "22:50").warnings.some((w) => w.includes("경칩"))).toBe(true);
    expect(saju("2026-03-15", "12:00").warnings.some((w) => w.includes("절입"))).toBe(false);
  });

  test("시간을 모르는데 출생일에 절입이 있으면 경고", () => {
    expect(saju("2024-02-04", null).warnings.some((w) => w.includes("입춘"))).toBe(true);
  });
});

describe("자정·자시 경계 (서울, 경도 보정 −32분)", () => {
  // 2024-03-01 = 갑자일, 2024-03-02 = 을축일 (KASI 2024-02-10 갑진일에서 20일 뒤)
  test("기준 일진", () => {
    expect(saju("2024-03-01", "12:00").pillars.day.ko).toBe("갑자");
    expect(saju("2024-03-02", "12:00").pillars.day.ko).toBe("을축");
  });
  test("시계 23:20 → 보정 22:48 → 해시, 당일", () => {
    const r = saju("2024-03-01", "23:20");
    expect(r.pillars.day.ko).toBe("갑자");
    expect(r.pillars.hour!.ko).toBe("을해");
  });
  test("시계 23:40 → 보정 23:08 → 자시: 23시 기준이면 다음 날 일주", () => {
    const r = saju("2024-03-01", "23:40");
    expect(r.pillars.day.ko).toBe("을축");
    expect(r.pillars.hour!.ko).toBe("병자");
  });
  test("시계 23:40 — 0시 기준(야자시)이면 당일 일주, 시주는 같음", () => {
    const r = saju("2024-03-01", "23:40", { dayBoundary: "00" });
    expect(r.pillars.day.ko).toBe("갑자");
    expect(r.pillars.hour!.ko).toBe("병자");
  });
  test("시계 00:20 → 보정 전날 23:48: 23시 기준이면 그대로 당일, 0시 기준이면 전날 일주", () => {
    expect(four(saju("2024-03-02", "00:20"))).toBe("갑진 병인 을축 병자");
    expect(four(saju("2024-03-02", "00:20", { dayBoundary: "00" }))).toBe("갑진 병인 갑자 병자");
  });
  test("시계 01:20 → 보정 00:48 → 아직 자시", () => {
    expect(saju("2024-03-02", "01:20").pillars.hour!.ko).toBe("병자");
    expect(saju("2024-03-02", "01:40").pillars.hour!.ko).toBe("정축");
  });
  test("표준시 기준이면 23:10이 바로 자시", () => {
    const r = saju("2024-03-01", "23:10", { correction: "standard" });
    expect(r.pillars.day.ko).toBe("을축");
    expect(r.pillars.hour!.ko).toBe("병자");
  });
  test("보정 방식에 따라 시주가 달라지면 경고와 비교표", () => {
    const r = saju("2024-03-01", "23:10");
    expect(r.pillars.hour!.ko).toBe("을해");
    expect(r.alternatives.some((a) => a.hour === "병자")).toBe(true);
    expect(r.warnings.some((w) => w.includes("보정 방식"))).toBe(true);
  });
});

describe("서머타임·표준시 변천", () => {
  test("1987-07-01 10:20 (서머타임) = 표준시 09:20 → 보정 08:48 → 진시", () => {
    const r = saju("1987-07-01", "10:20");
    expect(r.clock.dst).toBe(true);
    expect(r.pillars.hour!.pillar.branch).toBe(4); // 진
  });
  test("1956-01-01 12:00 (UTC+8:30) — 경도 보정 시각은 오프셋과 무관", () => {
    const r = saju("1956-01-01", "12:00");
    expect(r.clock.offsetMin).toBe(510);
    expect(r.solarTime!.hour).toBe(11);
    expect(r.solarTime!.minute).toBe(57);
  });
});

describe("오행·십신·12운성", () => {
  // 2000-01-01 12:00 서울: 기묘년 병자월 무오일 무오시 (일진은 KASI)
  const r = saju("2000-01-01", "12:00");
  test("명식", () => expect(four(r)).toBe("기묘 병자 무오 무오"));
  test("오행 분포", () => expect(r.elements).toEqual({ 목: 1, 화: 3, 토: 3, 금: 0, 수: 1 }));
  test("십신", () => {
    expect(r.pillars.year.stemTenGod).toBe("겁재"); // 무→기
    expect(r.pillars.month.stemTenGod).toBe("편인"); // 무→병
    expect(r.pillars.day.stemTenGod).toBeNull();
    expect(r.pillars.hour!.stemTenGod).toBe("비견");
    expect(r.pillars.year.branchTenGod).toBe("정관"); // 묘 정기 을
    expect(r.pillars.month.branchTenGod).toBe("정재"); // 자 정기 계
    expect(r.pillars.day.branchTenGod).toBe("정인"); // 오 정기 정
  });
  test("12운성 (무토, 화토동법)", () => {
    expect(r.pillars.year.twelveStage).toBe("목욕"); // 무-묘
    expect(r.pillars.month.twelveStage).toBe("태"); // 무-자
    expect(r.pillars.day.twelveStage).toBe("제왕"); // 무-오
  });
  test("시간 모름 — 시주 없음, 6글자", () => {
    const u = saju("2000-01-01", null);
    expect(u.pillars.hour).toBeNull();
    expect(Object.values(u.elements).reduce((a, b) => a + b, 0)).toBe(6);
  });
});

describe("대운", () => {
  test("경오년(양) 남자 순행, 여자 역행", () => {
    const m = saju("1990-05-15", "14:30");
    expect(m.daeun.forward).toBe(true);
    expect(m.daeun.items.slice(0, 3).map((d) => d.ko)).toEqual(["임오", "계미", "갑신"]);
    const f = saju("1990-05-15", "14:30", { gender: "F" });
    expect(f.daeun.forward).toBe(false);
    expect(f.daeun.items.slice(0, 3).map((d) => d.ko)).toEqual(["경진", "기묘", "무인"]);
  });
  test("대운수 = 절까지 일수 ÷ 3 반올림", () => {
    const m = saju("1990-05-15", "14:30");
    expect(m.daeun.number).toBe(Math.max(1, Math.round(m.daeun.deltaDays / 3)));
    expect(m.daeun.items.map((d) => d.label)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => m.daeun.number + 10 * k));
  });
});

describe("음력 입력", () => {
  test("음력 2023 윤2월 15일 = 양력 2023-04-05", () => {
    const r = computeSaju({ calendar: "lunar", year: 2023, month: 2, day: 15, isLeapMonth: true, time: { hour: 9, minute: 0 }, gender: "F", longitude: SEOUL, correction: "longitude", dayBoundary: "23" });
    expect(r.solarDate).toEqual({ year: 2023, month: 4, day: 5 });
    expect(r.pillars.year.ko).toBe("계묘");
  });
  test("없는 윤달은 오류", () => {
    expect(() => computeSaju({ calendar: "lunar", year: 2024, month: 2, day: 1, isLeapMonth: true, time: null, gender: "M", longitude: SEOUL, correction: "longitude", dayBoundary: "23" })).toThrow(SajuInputError);
  });
  test("없는 양력 날짜는 오류", () => {
    expect(() => saju("2023-02-29", "12:00")).toThrow(SajuInputError);
  });
});

describe("lunar-javascript(寿星万年历)와 무작위 교차 검증", () => {
  // 결정적 난수
  let seed = 20261019;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const WALL8 = (ms: number) => new Date(ms + 8 * 3600e3); // 베이징시 벽시계

  const cases = Array.from({ length: 3000 }, () => {
    const utcMs = Date.UTC(1901, 0, 1) + Math.floor(rand() * (Date.UTC(2099, 11, 31) - Date.UTC(1901, 0, 1)));
    return Math.floor(utcMs / 60000) * 60000;
  });

  test("연주·월주·일주·시주·대운 방향과 간지가 모두 일치 (절입 ±2분 제외)", () => {
    let checked = 0;
    for (const utcMs of cases) {
      const jie = jieAround(utcMs);
      if (Math.min(utcMs - jie.prev.utcMs, jie.next.utcMs - utcMs) < 2 * 60000) continue;
      // 우리 입력: 같은 순간을 당시 서울 시계(지방평균시·UTC+8:30·서머타임 포함)로
      const kst = new Date(utcMs + seoulOffsetAt(utcMs).offsetMin * 60000);
      for (const dayBoundary of ["23", "00"] as const) {
        for (const gender of ["M", "F"] as const) {
          const r = computeSaju({
            calendar: "solar", year: kst.getUTCFullYear(), month: kst.getUTCMonth() + 1, day: kst.getUTCDate(),
            time: { hour: kst.getUTCHours(), minute: kst.getUTCMinutes() }, gender, longitude: SEOUL, correction: "longitude", dayBoundary,
          });
          if (r.clock.resolution === "ambiguous" && r.birthUtcMs !== utcMs) continue; // 서머타임 종료로 겹친 1시간의 뒤쪽
          if (kst.getUTCSeconds() !== 0) continue; // 1908년 이전 지방평균시(+8:27:52)는 초 단위라 분 입력으로 재현 불가
          expect(r.birthUtcMs).toBe(utcMs);

          // 연·월: 같은 순간의 베이징 벽시계로 계산
          const w8 = WALL8(utcMs);
          const ec8 = Solar.fromYmdHms(w8.getUTCFullYear(), w8.getUTCMonth() + 1, w8.getUTCDate(), w8.getUTCHours(), w8.getUTCMinutes(), 0).getLunar().getEightChar();
          expect(r.pillars.year.hanja).toBe(ec8.getYear());
          expect(r.pillars.month.hanja).toBe(ec8.getMonth());

          // 일·시: 우리 보정 시각을 벽시계로 넣는다 (sect 1 = 23시에 일주 변경, sect 2 = 0시)
          const lt = new Date(solarLocalMs(utcMs, "longitude", SEOUL));
          const ecL = Solar.fromYmdHms(lt.getUTCFullYear(), lt.getUTCMonth() + 1, lt.getUTCDate(), lt.getUTCHours(), lt.getUTCMinutes(), lt.getUTCSeconds()).getLunar().getEightChar();
          ecL.setSect(dayBoundary === "23" ? 1 : 2);
          expect(r.pillars.day.hanja).toBe(ecL.getDay());
          expect(r.pillars.hour!.hanja).toBe(ecL.getTime());

          // 대운: 방향·간지·시작 나이 (lunar-javascript sect 2 = 분 단위, 4320분 = 1년)
          const yun = ec8.getYun(gender === "M" ? 1 : 0, 2);
          expect(r.daeun.forward).toBe(yun.isForward());
          const theirs = yun.getDaYun(11).slice(1, 11).map((d: { getGanZhi(): string }) => d.getGanZhi());
          expect(r.daeun.items.map((d) => d.hanja)).toEqual(theirs);
          const theirAge = yun.getStartYear() + yun.getStartMonth() / 12 + yun.getStartDay() / 360 + yun.getStartHour() / 8640;
          expect(Math.abs(r.daeun.items[0].startAgeExact - theirAge)).toBeLessThan(0.01); // 약 3.6일
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(11500);
  });

  test("60갑자 순환", () => {
    expect(pillarKo(sexagenary(0))).toBe("갑자");
    expect(pillarKo(sexagenary(59))).toBe("계해");
    expect(pillarKo(sexagenary(2024 - 4))).toBe("갑진");
  });
});
