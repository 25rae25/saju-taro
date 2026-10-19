/**
 * 타로 데이터·뽑기 검증.
 */
import { existsSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { CARDS } from "@/data/tarot/cards";
import { SPREADS } from "@/data/tarot/spreads";
import { cryptoRandomInt, draw, shuffle } from "@/lib/tarot/draw";

const SUITS = ["wands", "cups", "swords", "pentacles"] as const;
const MAJOR_EN = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers",
  "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
];
const RANK_EN = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

describe("78장 구성", () => {
  test("메이저 22 + 마이너 56, id 중복 없음", () => {
    expect(CARDS).toHaveLength(78);
    expect(CARDS.filter((c) => c.arcana === "major")).toHaveLength(22);
    for (const s of SUITS) expect(CARDS.filter((c) => c.suit === s)).toHaveLength(14);
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(78);
  });

  test("메이저 번호·이름 (웨이트–스미스: 8 힘, 11 정의)", () => {
    CARDS.filter((c) => c.arcana === "major").forEach((c, i) => {
      expect(c.number).toBe(i);
      expect(c.id).toBe(`major-${String(i).padStart(2, "0")}`);
      expect(c.nameEn).toBe(MAJOR_EN[i]);
      expect(c.suit).toBeNull();
    });
  });

  test.each(SUITS)("%s 1~14 순서와 이름", (suit) => {
    const cap = suit[0].toUpperCase() + suit.slice(1);
    CARDS.filter((c) => c.suit === suit).forEach((c, i) => {
      expect(c.arcana).toBe("minor");
      expect(c.number).toBe(i + 1);
      expect(c.id).toBe(`${suit}-${String(i + 1).padStart(2, "0")}`);
      expect(c.nameEn).toBe(`${RANK_EN[i]} of ${cap}`);
    });
  });

  test.each(CARDS.map((c) => [c.id, c] as const))("%s: 정·역방향 키워드 3~5개, 풀이·원전 출처", (_, c) => {
    for (const side of [c.upright, c.reversed]) {
      expect(side.keywords.length).toBeGreaterThanOrEqual(3);
      expect(side.keywords.length).toBeLessThanOrEqual(5);
      side.keywords.forEach((k) => expect(k.trim()).not.toBe(""));
      expect(side.meaning.length).toBeGreaterThan(20);
    }
    expect(c.upright.meaning).not.toBe(c.reversed.meaning);
    expect(c.waite.upright.trim()).not.toBe("");
    expect(c.waite.reversed.trim()).not.toBe("");
    expect(c.waite.source).toMatch(/^https:\/\/sacred-texts\.com\/tarot\/pkt\//);
    expect(c.nameKo.trim()).not.toBe("");
  });

  test("카드 이미지 파일 (public/cards)", () => {
    const missing = CARDS.filter((c) => !existsSync(new URL(`../public/cards/${c.id}.jpg`, import.meta.url))).map((c) => c.id);
    expect(missing).toEqual([]);
  });
});

describe("스프레드", () => {
  test("1장·3장", () => {
    expect(SPREADS.map((s) => s.positions.length)).toEqual([1, 3]);
    expect(SPREADS[1].positions.map((p) => p.label)).toEqual(["과거", "현재", "미래"]);
  });
});

describe("섞기·뽑기", () => {
  test("섞은 덱은 0~77 순열", () => {
    const s = shuffle(78);
    expect([...s].sort((a, b) => a - b)).toEqual(Array.from({ length: 78 }, (_, i) => i));
  });

  test("한 번에 뽑은 카드는 중복되지 않음", () => {
    for (let i = 0; i < 200; i++) {
      const d = draw(78, 3, true);
      expect(new Set(d.map((x) => x.index)).size).toBe(3);
    }
  });

  test("역방향 끄면 모두 정방향", () => {
    expect(draw(78, 3, false).every((d) => !d.reversed)).toBe(true);
  });

  test("균등성 — 7만8천 번 첫 장 분포 카이제곱", () => {
    const N = 78_000;
    const counts = new Array(78).fill(0);
    let reversed = 0;
    for (let i = 0; i < N; i++) {
      const [d] = draw(78, 1, true);
      counts[d.index]++;
      if (d.reversed) reversed++;
    }
    const expected = N / 78;
    const chi2 = counts.reduce((a, c) => a + (c - expected) ** 2 / expected, 0);
    // 자유도 77, 유의수준 0.001 임계값 ≈ 126.6
    expect(chi2).toBeLessThan(126.6);
    expect(Math.abs(reversed / N - 0.5)).toBeLessThan(0.01);
  });

  test("cryptoRandomInt 범위", () => {
    for (let i = 0; i < 1000; i++) {
      const v = cryptoRandomInt(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });
});
