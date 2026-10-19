/**
 * 한국 표준시(Asia/Seoul) 변천 테이블 생성기.
 *
 * 출처: IANA tz database (퍼블릭 도메인) — Node 내장 ICU의 tz 데이터를 그대로 읽는다.
 * 1908 UTC+8:30, 1912 UTC+9, 1954 UTC+8:30, 1961 UTC+9 변경과 1948–51·1955–60·1987–88 서머타임이 들어 있다.
 * 런타임은 브라우저/서버의 tz 데이터 버전 차이를 피하려고 이 JSON만 쓴다.
 *
 * 실행: npm run gen:tz
 */
import { writeFileSync } from "node:fs";

const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", timeZoneName: "longOffset" });

function offsetMinutes(ms: number): number {
  const v = fmt.formatToParts(new Date(ms)).find((p) => p.type === "timeZoneName")!.value; // GMT+08:27:52
  const m = /GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?/.exec(v);
  if (!m) throw new Error(`해석 불가: ${v}`);
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]) + Number(m[4] ?? 0) / 60);
}

const start = Date.UTC(1890, 0, 1);
const end = Date.UTC(2101, 0, 1);
const transitions: { utc: string; offsetMinutes: number; dst: boolean }[] = [];
let prev = offsetMinutes(start);
const initial = prev;

for (let t = start; t < end; t += 3600e3) {
  const cur = offsetMinutes(t + 3600e3);
  if (cur !== prev) {
    // 1시간 구간 안에서 초 단위로 이분 탐색
    let lo = t, hi = t + 3600e3;
    while (hi - lo > 1000) {
      const mid = lo + Math.floor((hi - lo) / 2000) * 1000;
      if (offsetMinutes(mid) === prev) lo = mid; else hi = mid;
    }
    transitions.push({ utc: new Date(hi).toISOString().replace(".000Z", "Z"), offsetMinutes: cur, dst: false });
    prev = cur;
  }
}

// 서머타임 표시: 직전보다 정확히 60분 앞당겨졌다가 1년 안에 직전 오프셋으로 돌아오는 구간
for (let i = 0; i < transitions.length - 1; i++) {
  const before = i === 0 ? initial : transitions[i - 1].offsetMinutes;
  const cur = transitions[i], next = transitions[i + 1];
  const span = Date.parse(next.utc) - Date.parse(cur.utc);
  if (cur.offsetMinutes - before === 60 && next.offsetMinutes === before && span < 366 * 86400e3) cur.dst = true;
}

const out = {
  meta: {
    description: "Asia/Seoul UTC 오프셋 변천. utc 시각부터 offsetMinutes 적용(dst=true면 서머타임, 표준시는 offsetMinutes-60). 그 이전은 initialOffsetMinutes(지방평균시 LMT).",
    source: `IANA tz database ${process.versions.tz} (via Node ${process.version}, ICU ${process.versions.icu})`,
    license: "Public domain (IANA tz database)",
  },
  initialOffsetMinutes: initial,
  transitions,
};

writeFileSync(new URL("../src/data/seoul-tz.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`전환 ${transitions.length}건, tz ${process.versions.tz}`);
