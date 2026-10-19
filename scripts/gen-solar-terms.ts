/**
 * 24절기 시각 테이블 생성기.
 *
 * - 1차 값: lunar-javascript (MIT, 寿星天文历 계열 알고리즘, 베이징시 UTC+8 → UTC 변환).
 *   한국천문연구원(KASI) 2021–2028 발표 시각(분 단위 반올림) 192개 중 187개와 분까지 같고 나머지도 ±31초 이내.
 *   astronomy-engine은 최대 ±60초 차이가 나서 1차 값으로 쓰지 않는다 (tests/solar-terms.test.ts 참고).
 * - 독립 교차 검증: astronomy-engine (MIT) SearchSunLongitude — 태양 시황경이 15°의 배수가 되는 순간.
 *   두 값 차이가 MAX_DIFF_SEC를 넘으면 생성을 중단한다.
 * - 출력: src/data/solar-terms.json (UTC, 초 단위). 런타임은 이 파일만 읽는다.
 *
 * 실행: npm run gen:terms
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as Astronomy from "astronomy-engine";

const require = createRequire(import.meta.url);
const { Solar } = require("lunar-javascript");
const pkgVersion = (name: string) =>
  JSON.parse(readFileSync(new URL(`../node_modules/${name}/package.json`, import.meta.url), "utf8")).version as string;

const FIRST_YEAR = 1899;
const LAST_YEAR = 2101;
const MAX_DIFF_SEC = 90;

// 양력 1월부터의 순서. [한글, 한자(간체: lunar-javascript 키), 황경]
const TERMS: [string, string, number][] = [
  ["소한", "小寒", 285], ["대한", "大寒", 300], ["입춘", "立春", 315], ["우수", "雨水", 330],
  ["경칩", "惊蛰", 345], ["춘분", "春分", 0], ["청명", "清明", 15], ["곡우", "谷雨", 30],
  ["입하", "立夏", 45], ["소만", "小满", 60], ["망종", "芒种", 75], ["하지", "夏至", 90],
  ["소서", "小暑", 105], ["대서", "大暑", 120], ["입추", "立秋", 135], ["처서", "处暑", 150],
  ["백로", "白露", 165], ["추분", "秋分", 180], ["한로", "寒露", 195], ["상강", "霜降", 210],
  ["입동", "立冬", 225], ["소설", "小雪", 240], ["대설", "大雪", 255], ["동지", "冬至", 270],
];

// lunar-javascript 절기표는 음력 해 기준이라 앞뒤 해 절기를 병음 키(DONG_ZHI 등)로 함께 담는다.
const PINYIN: Record<string, string> = {
  DONG_ZHI: "冬至", XIAO_HAN: "小寒", DA_HAN: "大寒", LI_CHUN: "立春", YU_SHUI: "雨水", JING_ZHE: "惊蛰",
};

function lunarJsInstant(year: number, zh: string): number | null {
  for (const probeYear of [year - 1, year, year + 1]) {
    const table = Solar.fromYmd(probeYear, 7, 1).getLunar().getJieQiTable();
    for (const [key, s] of Object.entries<{ getYear(): number; getMonth(): number; getDay(): number; getHour(): number; getMinute(): number; getSecond(): number }>(table)) {
      if ((PINYIN[key] ?? key) === zh && s.getYear() === year) {
        return Date.UTC(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour() - 8, s.getMinute(), s.getSecond());
      }
    }
  }
  return null;
}

const years: Record<string, string[]> = {};
let maxDiff = 0;
let maxDiffAt = "";

for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
  const row: string[] = [];
  let cursor = new Date(Date.UTC(y, 0, 1));
  for (const [ko, zh, lon] of TERMS) {
    const primary = lunarJsInstant(y, zh);
    if (primary === null) throw new Error(`${y} ${ko}: lunar-javascript 값 없음`);
    if (new Date(primary).getUTCFullYear() !== y) throw new Error(`${y} ${ko}: 연도 불일치 ${new Date(primary).toISOString()}`);
    row.push(new Date(primary).toISOString().replace(".000Z", "Z"));

    const t = Astronomy.SearchSunLongitude(lon, cursor, 40);
    if (!t) throw new Error(`${y} ${ko}: astronomy-engine 검색 실패`);
    cursor = new Date(t.date.getTime() + 86400e3);
    const diff = Math.abs(t.date.getTime() - primary) / 1000;
    if (diff > maxDiff) { maxDiff = diff; maxDiffAt = `${y} ${ko}`; }
    if (diff > MAX_DIFF_SEC) throw new Error(`${y} ${ko}: 교차검증 차이 ${diff}s > ${MAX_DIFF_SEC}s`);
  }
  years[y] = row;
}

const out = {
  meta: {
    description: "24절기 진입 시각 (UTC, 초 단위). 각 연도 배열은 양력 1월 소한부터 12월 동지까지 24개.",
    names: TERMS.map(([ko]) => ko),
    longitudes: TERMS.map(([, , lon]) => lon),
    range: [FIRST_YEAR, LAST_YEAR],
    generator: `lunar-javascript ${pkgVersion("lunar-javascript")} (寿星天文历 알고리즘)`,
    crossCheck: `astronomy-engine ${pkgVersion("astronomy-engine")} SearchSunLongitude, 최대 차이 ${maxDiff.toFixed(0)}초 (${maxDiffAt})`,
    verifiedAgainst: "한국천문연구원 달력자료 2021–2028 24절기 (tests/fixtures/kasi-solar-terms.json)",
  },
  years,
};

writeFileSync(new URL("../src/data/solar-terms.json", import.meta.url), JSON.stringify(out, null, 0).replace(/\],"/g, '],\n"'));
console.log(`생성 완료 ${FIRST_YEAR}–${LAST_YEAR}, 교차검증 최대 차이 ${maxDiff.toFixed(1)}초 (${maxDiffAt})`);
