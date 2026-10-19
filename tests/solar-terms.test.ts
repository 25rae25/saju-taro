/**
 * 절기 테이블 검증 — 한국천문연구원(KASI) 발표 시각, 독립 계산(astronomy-engine)과 대조.
 */
import { describe, expect, test } from "vitest";
import * as Astronomy from "astronomy-engine";
import kasi from "./fixtures/kasi-solar-terms.json";
import data from "@/data/solar-terms.json";
import { jieAround, nearestTerm } from "@/lib/saju/terms";

const years = data.years as Record<string, string[]>;
const kasiYears = kasi.years as Record<string, string[]>;

describe("KASI 2021–2028 24절기 (192개)", () => {
  const rows = Object.entries(kasiYears).flatMap(([y, list]) =>
    list.map((kst, i) => ({ y, i, name: kasi.meta.names[i], kasiMs: Date.parse(`${kst}:00+09:00`), oursMs: Date.parse(years[y][i]) })),
  );

  test("192개 모두 존재", () => expect(rows).toHaveLength(192));

  // KASI 값은 분 단위 반올림 → 참값은 [M−30초, M+30초). 우리 값 오차 1초 여유를 둔다.
  test.each(rows)("$y $name: KASI 분 값 ±31초 이내", ({ kasiMs, oursMs }) => {
    expect(Math.abs(oursMs - kasiMs) / 1000).toBeLessThanOrEqual(31);
  });

  test("분 단위로 반올림하면 97% 이상 KASI와 같다", () => {
    const same = rows.filter((r) => Math.round(r.oursMs / 60000) * 60000 === r.kasiMs).length;
    expect(same / rows.length).toBeGreaterThanOrEqual(0.97);
  });

  test("입춘 대표값 (KST)", () => {
    const kst = (y: number) => new Date(Date.parse(years[y][2]) + 9 * 3600e3).toISOString().slice(0, 16);
    expect(kst(2024)).toBe("2024-02-04T17:27");
    expect(kst(2025)).toBe("2025-02-03T23:10");
    expect(kst(2026)).toBe("2026-02-04T05:02");
  });
});

describe("테이블 구조", () => {
  test.each(Object.keys(years))("%s년: 24개, 시간순, 간격 14~16.5일", (y) => {
    const ms = years[y].map((s) => Date.parse(s));
    expect(ms).toHaveLength(24);
    for (let i = 0; i < 24; i++) expect(new Date(ms[i]).getUTCFullYear()).toBe(Number(y));
    for (let i = 1; i < 24; i++) {
      const gap = (ms[i] - ms[i - 1]) / 86400e3;
      expect(gap).toBeGreaterThan(14);
      expect(gap).toBeLessThan(16.5);
    }
  });
});

describe("독립 계산(astronomy-engine)과 교차 검증", () => {
  const LON = data.meta.longitudes;
  test.each([1900, 1930, 1954, 1960, 1987, 2000, 2050, 2100])("%s년 24기 모두 90초 이내", (y) => {
    years[y].forEach((iso, i) => {
      const t = Astronomy.SearchSunLongitude(LON[i], new Date(Date.parse(iso) - 3 * 86400e3), 6);
      expect(t).not.toBeNull();
      expect(Math.abs(t!.date.getTime() - Date.parse(iso)) / 1000).toBeLessThan(90);
    });
  });
});

describe("조회 함수", () => {
  test("입춘 직전·직후의 절 구간", () => {
    const ipchun = Date.parse(years[2024][2]);
    expect(jieAround(ipchun - 1000).prev.name).toBe("소한");
    expect(jieAround(ipchun).prev.name).toBe("입춘");
    expect(jieAround(ipchun + 1000).next.name).toBe("경칩");
    expect(nearestTerm(ipchun + 3 * 86400e3).name).toBe("입춘");
  });
});
